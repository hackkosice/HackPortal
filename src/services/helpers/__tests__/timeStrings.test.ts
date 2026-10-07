import dateToTimeString from "@/services/helpers/dateToTimeString";
import timeStringToDate from "@/services/helpers/timeStringToDate";

describe("time strings", () => {
  it("should format date to a padded time string", () => {
    expect(dateToTimeString(new Date(2026, 0, 1, 9, 5))).toBe("09:05");
    expect(dateToTimeString(new Date(2026, 0, 1, 23, 59))).toBe("23:59");
  });

  it("should convert a time string to a date", () => {
    const date = timeStringToDate("14:30");
    expect(date.getHours()).toBe(14);
    expect(date.getMinutes()).toBe(30);
    expect(dateToTimeString(date)).toBe("14:30");
  });
});
