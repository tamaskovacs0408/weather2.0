import { describe, it, expect, vi } from "vitest";
import { formatDate } from "../utils/dateFormatHelper";

describe("formatDate", () => {
  it("delegates to toLocaleTimeString with Hungarian locale", () => {
    const date = "2024-05-01T12:34:00Z";
    const toLocaleSpy = vi
      .spyOn(Date.prototype, "toLocaleTimeString")
      .mockReturnValue("14:34");

    const result = formatDate(date);

    expect(toLocaleSpy).toHaveBeenCalledWith("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    expect(result).toBe("14:34");

    toLocaleSpy.mockRestore();
  });
});
