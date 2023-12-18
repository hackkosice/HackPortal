import syncLocalApplicationDataWithServer from "@/server/actions/applicationForm/syncLocalApplicationDataWithServer";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";
import { render, waitFor } from "@testing-library/react";
import LocalApplicationDataSync from "@/scenes/Application/components/ApplicationForm/components/LocalApplicationDataSync";

jest.mock(
  "@/server/actions/applicationForm/syncLocalApplicationDataWithServer",
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);
const mockSyncLocalApplicationDataWithServer =
  syncLocalApplicationDataWithServer as jest.Mock;

jest.mock("@/services/helpers/localData/getLocalApplicationData", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockGetLocalApplicationData = getLocalApplicationData as jest.Mock;

jest.mock("@/services/helpers/localData/clearLocalApplicationData", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockClearLocalApplicationData = clearLocalApplicationData as jest.Mock;

const mockedData = [
  {
    fieldId: 1,
    stepId: 1,
    fieldType: "text",
    value: "test",
  },
];

describe("LocalApplicationDataSync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call sync data when applicationId is not null and localApplicationData is not null", async () => {
    mockGetLocalApplicationData.mockReturnValue(mockedData);
    render(<LocalApplicationDataSync applicationId={1} hackathonId={1} />);
    expect(mockSyncLocalApplicationDataWithServer).toHaveBeenCalledWith({
      hackathonId: 1,
      localApplicationData: mockedData,
    });
    await waitFor(() =>
      expect(mockClearLocalApplicationData).toHaveBeenCalled()
    );
  });

  it("should not call sync data when applicationId is null", () => {
    const { rerender } = render(
      <LocalApplicationDataSync applicationId={null} hackathonId={1} />
    );
    expect(mockSyncLocalApplicationDataWithServer).not.toHaveBeenCalled();
    rerender(<LocalApplicationDataSync applicationId={1} hackathonId={1} />);
    expect(mockSyncLocalApplicationDataWithServer).toHaveBeenCalled();
  });

  it("should not call sync data when localApplicationData is undefined", () => {
    mockGetLocalApplicationData.mockReturnValue(undefined);
    render(<LocalApplicationDataSync applicationId={1} hackathonId={1} />);
    expect(mockSyncLocalApplicationDataWithServer).not.toHaveBeenCalled();
  });

  it("should not clear data if syncing fails", async () => {
    mockGetLocalApplicationData.mockReturnValue(mockedData);
    mockSyncLocalApplicationDataWithServer.mockImplementation(() => {
      throw new Error();
    });
    render(<LocalApplicationDataSync applicationId={1} hackathonId={1} />);
    expect(mockSyncLocalApplicationDataWithServer).toHaveBeenCalledWith({
      hackathonId: 1,
      localApplicationData: mockedData,
    });
    await waitFor(() =>
      expect(mockClearLocalApplicationData).not.toHaveBeenCalled()
    );
  });
});
