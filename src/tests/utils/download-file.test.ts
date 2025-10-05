import { describe, it, vi, expect } from "vitest";
import { downloadFile } from "@/shared/utils/download-file";

window.URL.createObjectURL = vi.fn(() => "blob:url");
describe("downloadFile", () => {
  it("should trigger download for valid blob and filename (success case)", () => {
    // Arrange
    const mockBlob = new Blob(["test content"], { type: "text/plain" });
    const mockCreateElement = vi.spyOn(document, "createElement");
    const mockLink = document.createElement("a");
    const mockClick = vi.fn();
    mockLink.click = mockClick;
    mockCreateElement.mockReturnValue(mockLink);

    const mockCreateObjectURL = vi
      .spyOn(window.URL, "createObjectURL")
      .mockReturnValue("blob:url");
    const mockRemove = vi.spyOn(mockLink, "remove");

    // Act
    downloadFile(mockBlob, "test.txt");

    // Assert
    expect(mockCreateElement).toHaveBeenCalledWith("a");
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockLink.href).toBe("blob:url");
    expect(mockLink.download).toBe("test.txt");
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();

    // Cleanup
    mockCreateElement.mockRestore();
    mockCreateObjectURL.mockRestore();
    mockRemove.mockRestore();
  });

  it("should throw error if blob is invalid (error case)", () => {
    // Arrange
    vi.spyOn(window.URL, "createObjectURL").mockImplementation(() => {
      throw new Error("Invalid blob");
    });

    // Act & Assert
    expect(() =>
      downloadFile(undefined as unknown as Blob, "test.txt")
    ).toThrow("Invalid blob");
  });

  it("should handle edge case: empty filename", () => {
    // Arrange
    const mockBlob = new Blob(["test content"], { type: "text/plain" });
    const mockCreateElement = vi.spyOn(document, "createElement");
    const mockLink = document.createElement("a");
    const mockClick = vi.fn();
    mockLink.click = mockClick;
    mockCreateElement.mockReturnValue(mockLink);

    vi.spyOn(window.URL, "createObjectURL").mockReturnValue("blob:url");
    vi.spyOn(mockLink, "remove");

    // Act
    downloadFile(mockBlob, "");

    // Assert
    expect(mockLink.download).toBe("");
  });
});
