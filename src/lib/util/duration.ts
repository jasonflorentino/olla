export function formatNanoseconds(ns: number) {
  if (typeof ns !== "number" || ns < 0) {
    throw new Error("Input must be a non-negative number");
  }

  const ms = ns / 1e6; // 1 millisecond = 1,000,000ns
  if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  }

  const s = ms / 1000;
  if (s < 60) {
    return `${s.toFixed(2)}s`;
  }

  const minutes = Math.floor(s / 60);
  const seconds = (s % 60).toFixed(2);

  return `${minutes}:${seconds}`;
}

export function getRelativeTime(date: Date, base = new Date()) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  const diff = (date.getTime() - base.getTime()) / 1000; // difference in seconds
  const absDiff = Math.abs(diff);

  if (absDiff < 60) {
    return rtf.format(Math.round(diff), "second");
  } else if (absDiff < 3600) {
    return rtf.format(Math.round(diff / 60), "minute");
  } else if (absDiff < 86400) {
    return rtf.format(Math.round(diff / 3600), "hour");
  } else if (absDiff < 2592000) {
    return rtf.format(Math.round(diff / 86400), "day");
  } else if (absDiff < 31536000) {
    return rtf.format(Math.round(diff / 2592000), "month");
  } else {
    return rtf.format(Math.round(diff / 31536000), "year");
  }
}
