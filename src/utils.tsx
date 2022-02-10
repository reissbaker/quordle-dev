import { START_DATE } from "./constants";

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
