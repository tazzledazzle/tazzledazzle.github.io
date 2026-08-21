"""
scheduler.py — Weekly Deployment-Window Scheduler
Hard · Stripe · Software Engineer

O(N log N) sweep-line solution.  No minute-by-minute iteration.

Parts
-----
1  Allowed − freeze on one canonical UTC week (no timezone offsets).
2  Repeating local schedule projected onto a one-week absolute horizon.
3  Multi-week search: collect k qualifying windows across up to max_weeks horizons.
4  Greedy deployment packing: fit k tasks back-to-back inside available windows.

Entry point
-----------
    schedule_deployments(part, input_csv) -> list[list[int]]
"""

from __future__ import annotations

W: int = 10_080  # 7 × 24 × 60 minutes per week

Interval = tuple[int, int]  # half-open [start, end)


# ── interval primitives ───────────────────────────────────────────────────────

def merge_intervals(ivs: list[Interval]) -> list[Interval]:
    """Sort and merge overlapping / touching half-open intervals. O(N log N)."""
    if not ivs:
        return []
    out: list[Interval] = []
    for s, e in sorted(ivs):
        if out and s <= out[-1][1]:
            out[-1] = (out[-1][0], max(out[-1][1], e))
        else:
            out.append((s, e))
    return out


def subtract_intervals(
    allowed: list[Interval],
    freeze: list[Interval],
) -> list[Interval]:
    """
    Remove every freeze minute from allowed.

    The freeze pointer (fi) advances monotonically across the outer loop.
    Each freeze interval is consumed at most once, giving amortized O(A+F)
    inner work after the O((A+F) log(A+F)) sort.

    A freeze that straddles the end of an allowed window is NOT consumed
    (fi is not advanced past it); the next allowed window picks it up.
    """
    allowed = merge_intervals(allowed)
    freeze  = merge_intervals(freeze)
    out: list[Interval] = []
    fi = 0

    for a0, a1 in allowed:
        cur = a0
        while fi < len(freeze) and freeze[fi][1] <= cur:
            fi += 1
        while fi < len(freeze) and freeze[fi][0] < a1:
            f0, f1 = freeze[fi]
            if cur < f0:
                out.append((cur, f0))
            cur = max(cur, f1)
            if f1 >= a1:
                break       # freeze straddles a1; keep fi here for next allowed
            fi += 1         # freeze fully consumed within [a0, a1)
        if cur < a1:
            out.append((cur, a1))

    return out


def cyclic_to_utc(ls: int, le: int, off: int) -> list[Interval]:
    """
    Convert a cyclic local interval to one or two canonical UTC-week pieces.

    off:      UTC = local − off (any integer; normalised mod W internally).
    ls == le: full local week → [(0, W)].
    Otherwise duration = (le − ls) % W ∈ [1, W−1].  The unwrapped UTC
    endpoint utc_start + duration lies in [1, 2W−1], crossing at most one
    week boundary.
    """
    if ls == le:
        return [(0, W)]
    dur = (le - ls) % W            # forward duration in local time
    us  = (ls - off) % W           # utc_start ∈ [0, W)
    ue  = us + dur                  # utc_end_unwrapped ∈ [1, 2W−1]
    if ue <= W:
        return [(us, ue)]
    return [(us, W), (0, ue - W)]


def build_weekly(rows: list[tuple[int, int, str, int]]) -> list[Interval]:
    """
    Build the deployable UTC-week schedule from (ls, le, type, offset) tuples.

    Unions all allowed pieces, unions all freeze pieces, then subtracts.
    Returns maximal disjoint intervals in [0, W].
    """
    allowed: list[Interval] = []
    freeze:  list[Interval] = []
    for ls, le, t, off in rows:
        (allowed if t == "allowed" else freeze).extend(cyclic_to_utc(ls, le, off))
    return subtract_intervals(allowed, freeze)


def project_horizon(
    weekly: list[Interval],
    earliest: int,
    end: int,
) -> list[Interval]:
    """
    Expand the repeating weekly schedule onto the absolute range [earliest, end).

    Iterates only the week indices that overlap [earliest, end), clips each
    cyclic slot, then merges.  The merge step fuses cross-week seams: a slot
    ending at W in week N and one beginning at 0 in week N+1 produce touching
    absolute endpoints and collapse into a single interval.
    """
    if not weekly:
        return []
    out: list[Interval] = []
    base = (earliest // W) * W
    while base < end:
        for ws, we in weekly:
            cs = max(base + ws, earliest)
            ce = min(base + we, end)
            if cs < ce:
                out.append((cs, ce))
        base += W
    return merge_intervals(out)


# ── CSV helpers ───────────────────────────────────────────────────────────────

def _rows4(lines: list[str]) -> list[tuple[int, int, str, int]]:
    """Parse `start,end,type,offset` CSV lines."""
    out: list[tuple[int, int, str, int]] = []
    for ln in lines:
        f = ln.split(",")
        out.append((int(f[0]), int(f[1]), f[2].strip(), int(f[3])))
    return out


def _keep(ivs: list[Interval], mc: int, k: int) -> list[list[int]]:
    """Return first k intervals whose length >= mc, as lists."""
    out: list[list[int]] = []
    for s, e in ivs:
        if e - s >= mc:
            out.append([s, e])
            if len(out) == k:
                break
    return out


# ── part implementations ──────────────────────────────────────────────────────

def _part1(csv: list[str]) -> list[list[int]]:
    """
    Part 1: allowed − freeze on one canonical UTC week.

    Row format: start,end,type   where 0 ≤ start < end ≤ W, type ∈ {allowed,freeze}.
    No timezone offsets.  Freeze always wins.
    """
    allowed: list[Interval] = []
    freeze:  list[Interval] = []
    for ln in csv:
        f = ln.split(",")
        iv: Interval = (int(f[0]), int(f[1]))
        (allowed if f[2].strip() == "allowed" else freeze).append(iv)
    return [[s, e] for s, e in subtract_intervals(allowed, freeze)]


def _part2(csv: list[str]) -> list[list[int]]:
    """
    Part 2: one-week absolute horizon with a repeating local schedule.

    Header row: utc_now,lead_time_minutes,min_continuous_minutes,k
    Schedule rows: start,end,type,timezone_offset_minutes

    horizon = [earliest, earliest+W)  where  earliest = utc_now + lead_time.
    Returns at most k intervals whose clipped length >= min_continuous_minutes.
    """
    h = csv[0].split(",")
    now, lead, mc, k = int(h[0]), int(h[1]), int(h[2]), int(h[3])
    if k == 0:
        return []
    wk  = build_weekly(_rows4(csv[1:]))
    ear = now + lead
    return _keep(project_horizon(wk, ear, ear + W), mc, k)


def _part3(csv: list[str]) -> list[list[int]]:
    """
    Part 3: multi-week search.

    Header: utc_now,lead_time_minutes,min_continuous_minutes,k,max_weeks
    Schedule rows: start,end,type,timezone_offset_minutes

    Searches up to max_weeks consecutive week-length horizons starting at
    earliest, collecting intervals until k qualifying windows are found.
    Projecting the full range at once preserves cross-week merging.
    """
    h = csv[0].split(",")
    now, lead, mc, k = int(h[0]), int(h[1]), int(h[2]), int(h[3])
    max_w = int(h[4]) if len(h) > 4 else 52
    if k == 0:
        return []
    wk = build_weekly(_rows4(csv[1:]))
    if not wk:
        return []
    ear = now + lead
    # Project the entire search range at once so cross-week seams merge correctly.
    all_ivs = project_horizon(wk, ear, ear + max_w * W)
    return _keep(all_ivs, mc, k)


def _part4(csv: list[str]) -> list[list[int]]:
    """
    Part 4: greedy deployment packing.

    Header: utc_now,lead_time_minutes,min_window_minutes,k,max_weeks
    Schedule rows: start,end,allowed|freeze,timezone_offset_minutes
    Deploy rows:   duration_minutes,deploy

    Packs the first k deploy tasks back-to-back inside available windows
    (earliest-fit, no overlap between tasks).  A task too large for any
    remaining window produces a [-1, -1] sentinel and the next task continues
    from the same position in the window list.
    """
    h = csv[0].split(",")
    now, lead, mc, k = int(h[0]), int(h[1]), int(h[2]), int(h[3])
    max_w = int(h[4]) if len(h) > 4 else 52
    if k == 0:
        return []

    sched: list[tuple[int, int, str, int]] = []
    durs:  list[int] = []
    for ln in csv[1:]:
        f = ln.split(",")
        # Deploy rows: "duration,deploy" — type marker is at f[1], not f[2].
        if len(f) >= 2 and f[1].strip() == "deploy":
            durs.append(int(f[0]))
        else:
            sched.append((int(f[0]), int(f[1]), f[2].strip(), int(f[3])))

    wk  = build_weekly(sched)
    ear = now + lead
    # Collect and filter windows across the full search horizon.
    raw     = project_horizon(wk, ear, ear + max_w * W)
    windows = [(s, e) for s, e in raw if e - s >= mc]

    result:  list[list[int]] = []
    wi_idx = 0
    cur: int | None = None  # tracks position within the current window

    for dur in durs[:k]:
        placed = False
        # Save cursor state; restore it on failure so the next (smaller) task
        # can retry from the same position rather than a vacated window.
        save_wi  = wi_idx
        save_cur = cur
        while wi_idx < len(windows):
            ws, we = windows[wi_idx]
            if cur is not None and cur > we:
                wi_idx += 1
                cur = None
                continue
            pos = cur if (cur is not None and cur >= ws) else ws
            if pos + dur <= we:
                result.append([pos, pos + dur])
                cur = pos + dur
                placed = True
                break
            wi_idx += 1
            cur = None
        if not placed:
            result.append([-1, -1])
            wi_idx = save_wi
            cur    = save_cur

    return result


# ── entry point ───────────────────────────────────────────────────────────────

def schedule_deployments(part: str, input_csv: list[str]) -> list[list[int]]:
    """
    Dispatch to the correct part handler.

    Args:
        part:      "1", "2", "3", or "4".
        input_csv: Raw CSV lines; no trailing newlines required.

    Returns:
        List of [start, end] pairs (absolute minutes for parts 2-4).
    """
    dispatch = {
        "1": _part1,
        "2": _part2,
        "3": _part3,
        "4": _part4,
    }
    if part not in dispatch:
        raise ValueError(f"Unknown part {part!r}; expected one of {sorted(dispatch)}")
    return dispatch[part](input_csv)
