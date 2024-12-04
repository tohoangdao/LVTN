import moment from "moment";

export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";
export const DEFAULT_TIME_FORMAT = "HH:mm:ss";
export const DEFAULT_DATE_TIME_FORMAT = "HH:mm:ss DD/MM/yyyy";
export const HH_MM_FORMAT = "HH:mm";

export function convertDateToFormat(date: Date, format?: string): string {
  const mo = moment(date);

  return format ? mo.format(format) : mo.format(DEFAULT_DATE_FORMAT);
}

/**
 * default date is of string format ISO 8601: 2024-02-27T19:24:55.589712+07:00,
 * if receive other formats, have to pass 'format' param
 */
export function convertToDateObject(stringDate: string, format?: string): Date {
  return format
    ? moment(stringDate, format).toDate()
    : moment(stringDate).toDate();
}

// default time format is HH:mm
export function convertTimeToDateObject(
  stringTime: string,
  ofFormat?: string,
): Date {
  const timeMoment = ofFormat
    ? moment(stringTime, ofFormat)
    : moment(stringTime, DEFAULT_TIME_FORMAT);
  const now = moment();
  const combined = now.clone().set({
    hour: timeMoment.get("hour"),
    minute: timeMoment.get("minute"),
    second: 0,
    millisecond: 0,
  });
  return combined.toDate();
}

interface ParsedTime {
  startTime: string;
  endTime: string;
  date: Date;
}

// To parse "10:20:30 10/02/1002 - 10:20:30 10/02/1002" --> Output: { startTime: '10:20:30', endTime: '10:20:30', date: '1002-02-10T00:00:00.000Z' }
export function parseTimeEventString(timeString: string): ParsedTime | null {
  const regex =
    /(\d{2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{4}) - (\d{2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{4})/;
  const match = timeString.match(regex);

  if (!match) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTime, startDate, endTime, endDate] = match;

  const dateParts = startDate.split("/");
  const dateObject = new Date(
    parseInt(dateParts[2]), // Year
    parseInt(dateParts[1]) - 1, // Month (0-based index)
    parseInt(dateParts[0]), // Day
  );

  return {
    startTime,
    endTime,
    date: dateObject,
  };
}

export function isEndTimeLater(
  startTime: string,
  endTime: string,
  format?: string,
): boolean {
  const startMoment = moment(startTime, format ?? DEFAULT_TIME_FORMAT);
  const endMoment = moment(endTime, format ?? DEFAULT_TIME_FORMAT);

  return endMoment.isAfter(startMoment);
}

// input format: HH:mm:ss dd/mm/yyyy --> "15:16:56 26/07/2024"
export function splitDateTime(dateTimeString: string): {
  time: Date;
  date: Date;
} {
  // Regular expression to match the format HH:mm:ss dd/mm/yyyy
  const regex =
    /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d) (0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (!regex.test(dateTimeString))
    throw new Error(
      "String datetime does NOT match format HH:mm:ss dd/mm/yyyy",
    );

  const [timeStr, dateStr] = dateTimeString.split(" ");
  const time = convertTimeToDateObject(timeStr, "HH:mm:ss");
  const date = convertToDateObject(dateStr, DEFAULT_DATE_FORMAT);

  return { time, date };
}
