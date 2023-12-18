import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";

jest.spyOn(Storage.prototype, "removeItem");
Storage.prototype.removeItem = jest.fn();

describe("clearLocalApplicationData", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("should remove the item", () => {
    expect(localStorage.removeItem).not.toHaveBeenCalled();
    clearLocalApplicationData();
    expect(localStorage.removeItem).toHaveBeenCalledWith("applicationData");
  });
});
