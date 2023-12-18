import formatBytesToString from "@/services/helpers/formatBytesToString";

describe("formatBytesToString", () => {
  it("should return correct value for 0 bytes", () => {
    const res = formatBytesToString(0);
    expect(res).toBe("0 Bytes");
  });

  it("should return correct value for 1 byte", () => {
    const res = formatBytesToString(1);
    expect(res).toBe("1 Bytes");
  });

  it("should return correct value for 1000 bytes", () => {
    const res = formatBytesToString(1000);
    expect(res).toBe("1 KB");
  });

  it("should return correct value for 2500000 bytes", () => {
    const res = formatBytesToString(2500000);
    expect(res).toBe("2.5 MB");
  });

  it("should return correct value for 5000000000 bytes", () => {
    const res = formatBytesToString(5000000000);
    expect(res).toBe("5.0 GB");
  });

  it("should return correct value for 10350000000000 bytes", () => {
    const res = formatBytesToString(10350000000000);
    expect(res).toBe("10.3 TB");
  });
});
