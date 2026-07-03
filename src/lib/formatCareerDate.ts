const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
] as const;

export function formatCareerDate(isoMonth: string): string {
  if (isoMonth === "Present") {
    return "Present";
  }

  const match = /^(\d{4})-(\d{2})$/.exec(isoMonth);
  if (!match) {
    return isoMonth;
  }

  const year = match[1];
  const monthIndex = Number.parseInt(match[2], 10) - 1;
  const month = MONTHS[monthIndex];

  if (!month) {
    return isoMonth;
  }

  return `${month} ${year}`;
}

export function formatCareerRange(start: string, end: string): string {
  return `${formatCareerDate(start)} – ${formatCareerDate(end)}`;
}
