const generateContent = jest.fn();
const getGenerativeModel = jest.fn(() => ({ generateContent }));
const GoogleGenerativeAI = jest.fn(() => ({ getGenerativeModel }));

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI,
}));

import { analyseFeedback } from "../src/services/gemini.services";

describe("analyseFeedback", () => {
  beforeEach(() => {
    generateContent.mockReset();
    getGenerativeModel.mockClear();
    GoogleGenerativeAI.mockClear();
  });

  it("parses a valid Gemini JSON response", async () => {
    generateContent.mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            category: "Feature Request",
            sentiment: "Positive",
            priority_score: 6,
            summary: "Users want a reusable export preset feature.",
            tags: ["export", "presets", "workflow"],
          }),
      },
    });

    await expect(
      analyseFeedback(
        "Add export presets",
        "Power users want saved export presets so they can run the same report format repeatedly.",
      ),
    ).resolves.toEqual({
      category: "Feature Request",
      sentiment: "Positive",
      priority_score: 6,
      summary: "Users want a reusable export preset feature.",
      tags: ["export", "presets", "workflow"],
    });

    expect(GoogleGenerativeAI).toHaveBeenCalledWith("test-gemini-api-key");
    expect(getGenerativeModel).toHaveBeenCalledWith({
      model: "gemini-test-model",
    });
    expect(generateContent).toHaveBeenCalledWith(
      expect.stringContaining("Title: Add export presets"),
    );
    expect(generateContent).toHaveBeenCalledWith(
      expect.stringContaining(
        "Description: Power users want saved export presets so they can run the same report format repeatedly.",
      ),
    );
  });

  it("throws a parse error when Gemini returns invalid JSON", async () => {
    generateContent.mockResolvedValue({
      response: {
        text: () => "not-json",
      },
    });

    await expect(
      analyseFeedback(
        "Broken response",
        "This payload should trigger the JSON parsing error path in the Gemini service.",
      ),
    ).rejects.toMatchObject({
      statusCode: 500,
      errorCode: "GEMINI_PARSE_ERROR",
    });
  });
});
