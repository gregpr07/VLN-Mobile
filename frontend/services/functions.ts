export function YoutubeTime(millisec: number) {
  let seconds: number = millisec / 1000;
  let minutes: number = Math.floor(seconds / 60);
  let hours: number = 0;
  let hours_str: string = "";
  let minutes_str: string = "";
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours_str = hours >= 10 ? hours.toString() : "0" + hours;
    minutes = minutes - hours * 60;
    minutes_str = minutes >= 10 ? minutes.toString() : "0" + minutes;
  }

  seconds = Math.floor(seconds % 60);
  let seconds_str: string = seconds >= 10 ? seconds.toString() : "0" + seconds;
  if (hours != 0) {
    return hours_str + ":" + minutes + ":" + seconds;
  }
  return minutes + ":" + seconds;
}

export function parseISOString(s: any) {
  let b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

/* const months = [
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
  "Dec",
]; */

export function isoFormatDMY(d: any) {
  return (
    /* d.getUTCDate() +
    " " +
    months[parseInt(d.getUTCMonth() + 1)] +
    ", " + */
    d.getUTCFullYear()
  );
}

export const shorterText = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
