"""
test_scheduler.py — pytest suite for the deployment-window scheduler.

Covers all edge cases from the problem statement:
  - Local/UTC wrap, start==end full week, lead times beyond one week
  - Cross-week adjacency, touching allowed/freeze endpoints
  - Full-week allowed, full-week freeze, k==0, empty allowed set
  - min_continuous==0, timezone offsets (positive, negative, large)
  - Part 3 multi-week collection, Part 4 greedy packing with sentinels
"""

import pytest

from scheduler import (
    W,
    Interval,
    build_weekly,
    cyclic_to_utc,
    merge_intervals,
    project_horizon,
    schedule_deployments,
    subtract_intervals,
)


# ── merge_intervals ───────────────────────────────────────────────────────────


class TestMergeIntervals:
    def test_empty(self) -> None:
        assert merge_intervals([]) == []

    def test_single(self) -> None:
        assert merge_intervals([(5, 10)]) == [(5, 10)]

    def test_disjoint_sorted(self) -> None:
        assert merge_intervals([(0, 5), (10, 15)]) == [(0, 5), (10, 15)]

    def test_overlapping(self) -> None:
        assert merge_intervals([(0, 10), (5, 15)]) == [(0, 15)]

    def test_touching_merges(self) -> None:
        assert merge_intervals([(0, 10), (10, 20)]) == [(0, 20)]

    def test_contained(self) -> None:
        assert merge_intervals([(0, 20), (5, 10)]) == [(0, 20)]

    def test_unsorted_input(self) -> None:
        # (10,20), (0,5), (3,12) → sorted: (0,5),(3,12),(10,20) → (0,20)
        assert merge_intervals([(10, 20), (0, 5), (3, 12)]) == [(0, 20)]

    def test_full_week(self) -> None:
        assert merge_intervals([(0, W)]) == [(0, W)]

    def test_three_disjoint(self) -> None:
        assert merge_intervals([(0, 10), (20, 30), (40, 50)]) == [
            (0, 10), (20, 30), (40, 50)
        ]


# ── subtract_intervals ────────────────────────────────────────────────────────


class TestSubtractIntervals:
    def test_example1_freeze_splits_allowed(self) -> None:
        assert subtract_intervals([(540, 600)], [(570, 585)]) == [
            (540, 570),
            (585, 600),
        ]

    def test_example2_union_then_subtract(self) -> None:
        result = subtract_intervals(
            [(0, 20), (10, 30)],
            [(5, 8), (20, 25)],
        )
        assert result == [(0, 5), (8, 20), (25, 30)]

    def test_freeze_covers_entire_allowed(self) -> None:
        assert subtract_intervals([(0, 100)], [(0, 100)]) == []

    def test_freeze_extends_past_allowed_end(self) -> None:
        assert subtract_intervals([(10, 50)], [(40, 100)]) == [(10, 40)]

    def test_freeze_starts_before_allowed(self) -> None:
        assert subtract_intervals([(20, 60)], [(0, 30)]) == [(30, 60)]

    def test_no_freeze(self) -> None:
        assert subtract_intervals([(0, 50)], []) == [(0, 50)]

    def test_no_allowed(self) -> None:
        assert subtract_intervals([], [(0, 50)]) == []

    def test_touching_freeze_at_allowed_start_no_overlap(self) -> None:
        # freeze [5,10) ends exactly where allowed [10,20) begins → no overlap
        assert subtract_intervals([(10, 20)], [(5, 10)]) == [(10, 20)]

    def test_freeze_touches_allowed_end(self) -> None:
        # freeze starts exactly at allowed end → no overlap
        assert subtract_intervals([(0, 50)], [(50, 100)]) == [(0, 50)]

    def test_multiple_freezes_inside(self) -> None:
        result = subtract_intervals(
            [(0, 100)],
            [(10, 20), (30, 40), (60, 70)],
        )
        assert result == [(0, 10), (20, 30), (40, 60), (70, 100)]

    def test_monotonic_pointer_across_allowed(self) -> None:
        # freeze [15,25) overlaps both allowed windows; pointer must not reset
        result = subtract_intervals(
            [(10, 20), (20, 30)],
            [(15, 25)],
        )
        assert result == [(10, 15), (25, 30)]

    def test_full_week_minus_no_freeze(self) -> None:
        assert subtract_intervals([(0, W)], []) == [(0, W)]

    def test_full_week_minus_full_week_freeze(self) -> None:
        assert subtract_intervals([(0, W)], [(0, W)]) == []


# ── cyclic_to_utc ─────────────────────────────────────────────────────────────


class TestCyclicToUtc:
    def test_full_week_start_equals_end(self) -> None:
        assert cyclic_to_utc(0, 0, 0) == [(0, W)]

    def test_full_week_nonzero_endpoints(self) -> None:
        assert cyclic_to_utc(500, 500, 300) == [(0, W)]

    def test_no_wrap_no_offset(self) -> None:
        assert cyclic_to_utc(100, 200, 0) == [(100, 200)]

    def test_positive_offset_shifts_left(self) -> None:
        # UTC = local − 60; local [120, 180] → UTC [60, 120]
        assert cyclic_to_utc(120, 180, 60) == [(60, 120)]

    def test_negative_offset_shifts_right(self) -> None:
        # UTC = local − (−60) = local + 60; local [100, 200] → UTC [160, 260]
        assert cyclic_to_utc(100, 200, -60) == [(160, 260)]

    def test_forward_wrap_at_week_boundary(self) -> None:
        # local [9000, 500]: duration = (500 − 9000) % W = 1580
        # utc_start = 9000, utc_end_unwrapped = 10580 > W
        result = cyclic_to_utc(9000, 500, 0)
        assert result == [(9000, W), (0, 500)]

    def test_utc_end_exactly_at_w(self) -> None:
        # utc_start = W−50, duration = 50 → utc_end_unwrapped = W (single piece)
        result = cyclic_to_utc(W - 50, 0, -(W - 50))  # off so utc_start = W-50
        # simpler: cyclic_to_utc(W-50, W-50+50 mod W = 0, offset=0)
        # ls=W-50, le=0, off=0 → dur=(0-(W-50))%W=50, us=W-50, ue=W
        result2 = cyclic_to_utc(W - 50, 0, 0)
        assert result2 == [(W - 50, W)]

    def test_large_offset_normalizes(self) -> None:
        # offset = 3*W+60 normalizes to 60; local [120,180] → UTC [60,120]
        assert cyclic_to_utc(120, 180, 3 * W + 60) == [(60, 120)]

    @pytest.mark.parametrize("ls,le,off", [
        (0, 1, 0),
        (5000, 5001, 0),
        (W - 1, 0, 0),   # duration = 1, wraps
    ])
    def test_one_minute_duration(self, ls: int, le: int, off: int) -> None:
        result = cyclic_to_utc(ls, le, off)
        total = sum(e - s for s, e in result)
        assert total == (le - ls) % W

    def test_duration_preserved_across_wrap(self) -> None:
        ls, le, off = 9500, 400, 0
        dur = (le - ls) % W
        result = cyclic_to_utc(ls, le, off)
        total = sum(e - s for s, e in result)
        assert total == dur


# ── project_horizon ───────────────────────────────────────────────────────────


class TestProjectHorizon:
    def test_empty_weekly(self) -> None:
        assert project_horizon([], 0, W) == []

    def test_full_week_projects_to_exact_horizon(self) -> None:
        result = project_horizon([(0, W)], 100, 100 + W)
        assert result == [(100, 100 + W)]

    def test_slot_clipped_at_horizon_start(self) -> None:
        # weekly [(0,200)]; horizon [100, W+100)
        result = project_horizon([(0, 200)], 100, 100 + W)
        # week 0: (100, 200); week 1: (W, W+200) clipped to (W, W+100)
        assert (100, 200) in result
        assert (W, W + 100) in result

    def test_cross_week_seam_merges(self) -> None:
        # weekly has slot ending at W and slot starting at 0
        # in repeated projections those absolute endpoints are equal → merge
        weekly = [(W - 50, W), (0, 50)]
        # horizon [W-10, 2W-10)
        result = project_horizon(weekly, W - 10, 2 * W - 10)
        # week 0: (W-50,W) clipped → (W-10,W); (0,50) → empty
        # week 1: (2W-50,2W) → (2W-50, 2W-10); (W,W+50) → (W,W+50)
        # after merge: (W-10,W) + (W,W+50) → (W-10, W+50)
        assert (W - 10, W + 50) in result

    def test_lead_beyond_one_week(self) -> None:
        weekly = [(200, 500)]
        ear = 3 * W + 100
        result = project_horizon(weekly, ear, ear + W)
        # week 3 offset: [3W+200, 3W+500] inside horizon [3W+100, 4W+100)
        # week 4 offset: [4W+200, 4W+500] clipped to (4W+200, min(4W+500,4W+100)) → empty
        assert result == [(3 * W + 200, 3 * W + 500)]

    def test_horizon_clips_both_ends(self) -> None:
        weekly = [(0, W)]
        ear = 100
        result = project_horizon(weekly, ear, ear + W)
        assert result == [(100, 100 + W)]

    def test_no_overlap_with_horizon(self) -> None:
        # weekly [500,600]; horizon [0,100) → nothing overlaps in week 0
        # week -1 is not iterated (base starts at (0//W)*W=0)
        result = project_horizon([(500, 600)], 0, 100)
        assert result == []


# ── Part 1 ────────────────────────────────────────────────────────────────────


class TestPart1:
    def test_example1(self) -> None:
        assert schedule_deployments("1", [
            "540,600,allowed",
            "570,585,freeze",
        ]) == [[540, 570], [585, 600]]

    def test_example2(self) -> None:
        assert schedule_deployments("1", [
            "0,20,allowed",
            "10,30,allowed",
            "5,8,freeze",
            "20,25,freeze",
        ]) == [[0, 5], [8, 20], [25, 30]]

    def test_no_allowed_rows(self) -> None:
        assert schedule_deployments("1", ["0,100,freeze"]) == []

    def test_empty_input(self) -> None:
        assert schedule_deployments("1", []) == []

    def test_full_week_allowed_no_freeze(self) -> None:
        assert schedule_deployments("1", [f"0,{W},allowed"]) == [[0, W]]

    def test_full_week_freeze_removes_everything(self) -> None:
        assert schedule_deployments("1", [
            f"0,{W},allowed",
            f"0,{W},freeze",
        ]) == []

    def test_touching_allowed_intervals_merge(self) -> None:
        assert schedule_deployments("1", [
            "0,100,allowed",
            "100,200,allowed",
        ]) == [[0, 200]]

    def test_freeze_at_start_of_allowed(self) -> None:
        assert schedule_deployments("1", [
            "0,100,allowed",
            "0,30,freeze",
        ]) == [[30, 100]]

    def test_freeze_at_end_of_allowed(self) -> None:
        assert schedule_deployments("1", [
            "0,100,allowed",
            "80,100,freeze",
        ]) == [[0, 80]]

    def test_multiple_freezes_produce_multiple_windows(self) -> None:
        result = schedule_deployments("1", [
            "0,1000,allowed",
            "200,300,freeze",
            "600,700,freeze",
        ])
        assert result == [[0, 200], [300, 600], [700, 1000]]

    def test_freeze_outside_allowed_has_no_effect(self) -> None:
        assert schedule_deployments("1", [
            "100,200,allowed",
            "500,600,freeze",
        ]) == [[100, 200]]


# ── Part 2 ────────────────────────────────────────────────────────────────────


class TestPart2:
    def _hdr(self, now: int, lead: int, mc: int, k: int) -> str:
        return f"{now},{lead},{mc},{k}"

    def test_k_zero_returns_empty(self) -> None:
        assert schedule_deployments("2", [
            self._hdr(0, 0, 0, 0),
            "0,600,allowed,0",
        ]) == []

    def test_no_allowed_rows(self) -> None:
        assert schedule_deployments("2", [
            self._hdr(0, 0, 0, 5),
            "0,600,freeze,0",
        ]) == []

    def test_full_week_freeze_returns_empty(self) -> None:
        # start==end → full week freeze
        assert schedule_deployments("2", [
            self._hdr(0, 0, 0, 5),
            "0,0,freeze,0",
        ]) == []

    def test_full_week_allowed(self) -> None:
        # start==end → full week allowed
        result = schedule_deployments("2", [
            self._hdr(0, 0, 0, 1),
            "0,0,allowed,0",
        ])
        assert result == [[0, W]]

    def test_basic_single_window(self) -> None:
        result = schedule_deployments("2", [
            self._hdr(0, 0, 0, 5),
            "100,200,allowed,0",
        ])
        assert result == [[100, 200]]

    def test_lead_time_shifts_horizon(self) -> None:
        # earliest=500; weekly=[(100,200)]; horizon [500,W+500)
        # week0: [100,200] < 500 → clipped empty
        # week1: [W+100,W+200] inside horizon ✓
        result = schedule_deployments("2", [
            self._hdr(0, 500, 0, 5),
            "100,200,allowed,0",
        ])
        assert result == [[W + 100, W + 200]]

    def test_min_continuous_filters_short_windows(self) -> None:
        result = schedule_deployments("2", [
            self._hdr(0, 0, 100, 5),
            "0,50,allowed,0",
            "200,500,allowed,0",
        ])
        assert result == [[200, 500]]

    def test_min_continuous_zero_keeps_all(self) -> None:
        result = schedule_deployments("2", [
            self._hdr(0, 0, 0, 5),
            "0,1,allowed,0",
            "100,101,allowed,0",
        ])
        assert len(result) == 2

    def test_k_limits_output(self) -> None:
        result = schedule_deployments("2", [
            self._hdr(0, 0, 0, 1),
            "0,500,allowed,0",
            "1000,1500,allowed,0",
        ])
        assert len(result) == 1
        assert result[0] == [0, 500]

    def test_utc_wrap_local_to_utc(self) -> None:
        # local [9000,500] offset=0 → UTC pieces [(9000,W),(0,500)]
        result = schedule_deployments("2", [
            self._hdr(0, 0, 0, 5),
            "9000,500,allowed,0",
        ])
        assert [0, 500] in result
        assert [9000, W] in result

    def test_cross_week_seam_merges_in_horizon(self) -> None:
        # weekly = [(0,50),(W-50,W)]; in horizon [W-10,2W-10)
        # (W-10,W) touches (W,W+50) → merged to (W-10,W+50)
        result = schedule_deployments("2", [
            self._hdr(0, W - 10, 0, 5),
            "9030,50,allowed,0",   # local→UTC: [W-50,W] and [0,50]
        ])
        # verify the merged cross-week interval is present
        intervals = [tuple(r) for r in result]
        cross = [(s, e) for s, e in intervals if s <= W and e >= W]
        assert cross, f"Expected cross-week merged interval; got {result}"

    def test_positive_timezone_offset(self) -> None:
        # offset=300; local [0,600] → utc_start=(0-300)%W=9780, dur=600
        # utc_end_unwrapped=10380 > W → pieces [(9780,W),(0,300)]
        result = schedule_deployments("2", [
            self._hdr(0, 0, 0, 5),
            "0,600,allowed,300",
        ])
        assert [9780, W] in result
        assert [0, 300] in result

    def test_negative_timezone_offset(self) -> None:
        # offset=-60; local [0,100] → utc_start=(0+60)%W=60; utc_end=160
        result = schedule_deployments("2", [
            self._hdr(0, 0, 0, 5),
            "0,100,allowed,-60",
        ])
        assert result == [[60, 160]]

    def test_lead_time_beyond_one_week(self) -> None:
        result = schedule_deployments("2", [
            self._hdr(0, 3 * W + 100, 0, 5),
            "200,500,allowed,0",
        ])
        assert result == [[3 * W + 200, 3 * W + 500]]

    def test_freeze_splits_window_in_horizon(self) -> None:
        result = schedule_deployments("2", [
            self._hdr(0, 0, 0, 5),
            "0,1000,allowed,0",
            "400,600,freeze,0",
        ])
        assert [0, 400] in result
        assert [600, 1000] in result

    def test_utc_now_not_minute_of_week(self) -> None:
        # utc_now=W+50 is absolute, not mod W; earliest=W+50+0=W+50
        result = schedule_deployments("2", [
            self._hdr(W + 50, 0, 0, 5),
            "100,200,allowed,0",
        ])
        # horizon [W+50, 2W+50); weekly [(100,200)]
        # week1: (W+100, W+200) inside ✓; week2: (2W+100,2W+200) clipped → empty
        assert result == [[W + 100, W + 200]]


# ── Part 3 ────────────────────────────────────────────────────────────────────


class TestPart3:
    def test_k_zero(self) -> None:
        assert schedule_deployments("3", ["0,0,0,0,4", "0,500,allowed,0"]) == []

    def test_collects_windows_across_weeks(self) -> None:
        # one window per week; collect 3
        result = schedule_deployments("3", [
            "0,0,0,3,5",
            "100,200,allowed,0",
        ])
        assert len(result) == 3
        assert result[0] == [100, 200]
        assert result[1] == [W + 100, W + 200]
        assert result[2] == [2 * W + 100, 2 * W + 200]

    def test_no_allowed_returns_empty(self) -> None:
        assert schedule_deployments("3", [
            "0,0,0,3,2",
            "0,500,freeze,0",
        ]) == []

    def test_max_weeks_caps_search(self) -> None:
        # only 1 week searched; weekly has 1 window; k=2 → only 1 returned
        result = schedule_deployments("3", [
            "0,0,0,2,1",
            "100,200,allowed,0",
        ])
        assert result == [[100, 200]]

    def test_min_continuous_filters_across_weeks(self) -> None:
        result = schedule_deployments("3", [
            "0,0,120,2,4",
            "0,60,allowed,0",      # 60 min — filtered
            "500,700,allowed,0",   # 200 min — kept
        ])
        # only the 200-min windows qualify
        assert all(e - s >= 120 for s, e in result)
        assert result[0] == [500, 700]
        assert result[1] == [W + 500, W + 700]

    def test_cross_week_merge_preserved(self) -> None:
        # local [10030,50] offset=0:
        #   dur=(50-10030)%W=100; utc_start=10030; utc_end_u=10130>W
        #   → UTC pieces [(W-50,W),(0,50)] — 100 min straddling the week seam.
        # With lead=W-50, horizon=[W-50, 3W-50):
        #   week0: (W-50,W) fully inside; (0,50) clipped below horizon
        #   week1: (W,W+50) and (2W-50,2W) — (W-50,W)+(W,W+50) merge → length 100
        result = schedule_deployments("3", [
            f"0,{W - 50},0,1,2",
            "10030,50,allowed,0",
        ])
        assert len(result) >= 1
        assert result[0][1] - result[0][0] == 100


# ── Part 4 ────────────────────────────────────────────────────────────────────


class TestPart4:
    def _csv(self, hdr: str, rows: list[str]) -> list[str]:
        return [hdr] + rows

    def test_k_zero_returns_empty(self) -> None:
        csv = self._csv("0,0,0,0,2", ["0,500,allowed,0", "30,deploy"])
        assert schedule_deployments("4", csv) == []

    def test_single_task_fits(self) -> None:
        csv = self._csv("0,0,0,1,2", ["0,500,allowed,0", "100,deploy"])
        assert schedule_deployments("4", csv) == [[0, 100]]

    def test_tasks_pack_back_to_back(self) -> None:
        csv = self._csv("0,0,0,3,2", [
            "0,500,allowed,0",
            "60,deploy", "60,deploy", "60,deploy",
        ])
        assert schedule_deployments("4", csv) == [[0, 60], [60, 120], [120, 180]]

    def test_task_too_large_for_any_window(self) -> None:
        csv = self._csv("0,0,0,1,2", [
            "0,100,allowed,0",
            "200,deploy",
        ])
        assert schedule_deployments("4", csv) == [[-1, -1]]

    def test_task_moves_to_next_window(self) -> None:
        # window1=[0,50], window2=[100,200]; task1=40 fits in w1, task2=40 needs w2
        csv = self._csv("0,0,0,2,2", [
            "0,50,allowed,0",
            "100,200,allowed,0",
            "40,deploy", "40,deploy",
        ])
        result = schedule_deployments("4", csv)
        assert result[0] == [0, 40]
        assert result[1] == [100, 140]

    def test_unschedulable_task_does_not_block_next(self) -> None:
        # Cursor state is saved before each task and restored on failure.
        # After task2 fails, cur resets to 5 (where task1 left off).
        # Task3 (dur=4) then fits at [5,9] within the same window [0,10].
        csv = self._csv("0,0,0,3,2", [
            "0,10,allowed,0",
            "5,deploy",   # fits → [0,5]; cur=5
            "20,deploy",  # too big → [-1,-1]; wi_idx and cur restored to (0,5)
            "4,deploy",   # retries from cur=5 → [5,9]
        ])
        result = schedule_deployments("4", csv)
        assert result[0] == [0, 5]
        assert result[1] == [-1, -1]
        assert result[2] == [5, 9]

    def test_min_window_filters_in_packing(self) -> None:
        # mc=100: window [0,50] too small and skipped; only [200,400] qualifies
        csv = self._csv("0,0,100,2,2", [
            "0,50,allowed,0",
            "200,400,allowed,0",
            "50,deploy", "50,deploy",
        ])
        result = schedule_deployments("4", csv)
        assert result == [[200, 250], [250, 300]]

    def test_lead_time_applied_to_packing(self) -> None:
        # lead=200; earliest=200; weekly [(0,500)]; effective window = [200,500]
        csv = self._csv("0,200,0,1,2", [
            "0,500,allowed,0",
            "100,deploy",
        ])
        result = schedule_deployments("4", csv)
        assert result == [[200, 300]]

    def test_tasks_span_week_boundary_in_packing(self) -> None:
        # local [9980,100] → UTC pieces [(9980,W),(0,100)]:
        #   (9980,W) from week 0 and (W,W+100) from week 1 merge → (9980,W+100).
        # Setting lead=9980 starts the horizon at minute 9980, skipping the
        # isolated (0,100) block and landing on the 200-min cross-week window.
        # Two 80-min tasks pack back-to-back inside (9980, W+100).
        csv = self._csv(f"0,9980,0,2,4", [
            "9980,100,allowed,0",
            "80,deploy", "80,deploy",
        ])
        result = schedule_deployments("4", csv)
        assert result[0][1] - result[0][0] == 80
        assert result[1][1] - result[1][0] == 80
        assert result[1][0] == result[0][1]  # packed back-to-back


# ── invalid part ──────────────────────────────────────────────────────────────


class TestInvalidPart:
    def test_unknown_part_raises(self) -> None:
        with pytest.raises(ValueError, match="Unknown part"):
            schedule_deployments("5", [])
