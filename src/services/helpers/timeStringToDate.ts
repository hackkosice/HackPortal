/**
 * Convert a time string in the format "HH:MM" to a Date object
 * @param time
 *
 * @returns Date
 */
const timeStringToDate = (time: string) => {
  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(hour));
  date.setMinutes(parseInt(minute));
  return date;
};

export default timeStringToDate;
