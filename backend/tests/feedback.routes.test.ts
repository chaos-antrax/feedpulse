import jwt from "jsonwebtoken";
import request from "supertest";

import { FeedbackModel } from "../src/models/feedback.model";
import { createApp } from "../src/app";
import { env } from "../src/config/env";
import { runFeedbackAnalysis } from "../src/services/feedbackAnalysis.service";

jest.mock("../src/services/feedbackAnalysis.service", () => ({
  runFeedbackAnalysis: jest.fn(),
}));

describe("feedback routes", () => {
  const app = createApp();
  const mockedRunFeedbackAnalysis = jest.mocked(runFeedbackAnalysis);
  const authToken = jwt.sign({ email: env.ADMIN_EMAIL }, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("POST /api/feedback saves a valid submission and triggers AI analysis", async () => {
    const createdAt = new Date("2026-04-05T12:00:00.000Z");
    const updatedAt = new Date("2026-04-05T12:00:00.000Z");
    const createdFeedback = {
      id: "680a8d0fd2d3e5b5f0f93c01",
      title: "Exported reports should preserve filters",
      description:
        "When I export a report, the selected filters are dropped and the CSV becomes misleading.",
      category: "Improvement",
      status: "New",
      submitterName: "Taylor",
      submitterEmail: "taylor@example.com",
      ai_tags: [],
      ai_processed: false,
      createdAt,
      updatedAt,
    };

    const createSpy = jest
      .spyOn(FeedbackModel, "create")
      .mockResolvedValue(createdFeedback as never);
    mockedRunFeedbackAnalysis.mockResolvedValue(null);

    const response = await request(app).post("/api/feedback").send({
      title: "Exported reports should preserve filters",
      description:
        "When I export a report, the selected filters are dropped and the CSV becomes misleading.",
      category: "Improvement",
      submitterName: "Taylor",
      submitterEmail: "taylor@example.com",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: createdFeedback.id,
        title: createdFeedback.title,
        description: createdFeedback.description,
        category: createdFeedback.category,
        status: "New",
        submitterName: "Taylor",
        submitterEmail: "taylor@example.com",
        ai_category: null,
        ai_sentiment: null,
        ai_priority: null,
        ai_summary: null,
        ai_tags: [],
        ai_processed: false,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
      message: "Feedback submitted successfully.",
    });
    expect(createSpy).toHaveBeenCalledWith({
      title: "Exported reports should preserve filters",
      description:
        "When I export a report, the selected filters are dropped and the CSV becomes misleading.",
      category: "Improvement",
      submitterName: "Taylor",
      submitterEmail: "taylor@example.com",
      status: "New",
      ai_tags: [],
      ai_processed: false,
    });
    expect(mockedRunFeedbackAnalysis).toHaveBeenCalledWith(
      createdFeedback.id,
      createdFeedback.title,
      createdFeedback.description,
    );
  });

  it("POST /api/feedback rejects an empty title", async () => {
    const createSpy = jest.spyOn(FeedbackModel, "create");

    const response = await request(app).post("/api/feedback").send({
      title: "   ",
      description:
        "The description is long enough to pass the minimum length validation.",
      category: "Bug",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "VALIDATION_ERROR",
      message: "Title is required.",
    });
    expect(createSpy).not.toHaveBeenCalled();
    expect(mockedRunFeedbackAnalysis).not.toHaveBeenCalled();
  });

  it("PATCH /api/feedback/:id updates the status for an authenticated request", async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const feedbackDocument = {
      id: "680a8d0fd2d3e5b5f0f93c02",
      title: "Dark mode contrast is too low",
      description:
        "Several labels become hard to read in dark mode, especially in the settings page.",
      category: "Bug",
      status: "New",
      submitterName: undefined,
      submitterEmail: undefined,
      ai_category: "Bug",
      ai_sentiment: "Negative",
      ai_priority: 8,
      ai_summary: "Dark mode makes form labels hard to read.",
      ai_tags: ["dark-mode", "accessibility"],
      ai_processed: true,
      createdAt: new Date("2026-04-05T12:10:00.000Z"),
      updatedAt: new Date("2026-04-05T12:15:00.000Z"),
      save,
    };

    const findByIdSpy = jest
      .spyOn(FeedbackModel, "findById")
      .mockResolvedValue(feedbackDocument as never);

    const response = await request(app)
      .patch(`/api/feedback/${feedbackDocument.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ status: "In Review" });

    expect(response.status).toBe(200);
    expect(findByIdSpy).toHaveBeenCalledWith(feedbackDocument.id);
    expect(feedbackDocument.status).toBe("In Review");
    expect(save).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: feedbackDocument.id,
        title: feedbackDocument.title,
        description: feedbackDocument.description,
        category: feedbackDocument.category,
        status: "In Review",
        submitterName: null,
        submitterEmail: null,
        ai_category: feedbackDocument.ai_category,
        ai_sentiment: feedbackDocument.ai_sentiment,
        ai_priority: feedbackDocument.ai_priority,
        ai_summary: feedbackDocument.ai_summary,
        ai_tags: feedbackDocument.ai_tags,
        ai_processed: true,
        createdAt: feedbackDocument.createdAt.toISOString(),
        updatedAt: feedbackDocument.updatedAt.toISOString(),
      },
      message: "Feedback status updated successfully.",
    });
  });

  it("protected routes reject unauthenticated requests", async () => {
    const response = await request(app)
      .patch("/api/feedback/680a8d0fd2d3e5b5f0f93c03")
      .send({ status: "Resolved" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      error: "UNAUTHORIZED",
      message: "Authorization token is required.",
    });
  });
});
