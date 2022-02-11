import { START_DATE, TimeUnits } from "./constants";
import { RelativeTimeFormatUnit } from "./types";

export const getCurrentDailySeed = () => {
  return ((new Date().getTime() - START_DATE.getTime()) / (1000 * 5)) >> 0;
};

export const indexOfAll = (str: string, char: string): number[] =>
  str
    .split("")
    .map((c, i) => (c === char ? i : null))
    .filter((i) => i !== null) as number[];

export const gtagWrap = (
  command: "event",
  eventName: string,
  eventParams?: Gtag.CustomParams | Gtag.ControlParams | Gtag.EventParams
) => {
  // @ts-ignore
  if (window.gtag) {
    gtag(command, eventName, eventParams);
  }
};

export const vibrate = () => {
  if (navigator.vibrate) {
    navigator.vibrate(1);
  }
};

export const timeUntil = (date1: Date, date2: Date) => {
  if ("RelativeTimeFormat" in Intl) {
    // @ts-ignore
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const elapsed = date2.valueOf() - date1.valueOf();
    for (const u in TimeUnits) {
      const unit = u as RelativeTimeFormatUnit;
      if (Math.abs(elapsed) > TimeUnits[unit] || u === "second") {
        return rtf.format(Math.round(elapsed / TimeUnits[unit]), unit);
      }
    }
    return `${elapsed} ms`;
  }

  const ms = date2.getTime() - date1.getTime();
  let interval = Math.floor(ms / TimeUnits.hour);
  if (interval > 1) {
    return "in " + interval + " hours";
  }
  interval = Math.floor(ms / TimeUnits.minute);
  if (interval > 1) {
    return "in " + interval + " minutes";
  }
  return "in " + Math.floor(ms / TimeUnits.second) + " seconds";
};
