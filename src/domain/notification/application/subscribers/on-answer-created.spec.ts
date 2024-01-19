import { makeAnswer } from "test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("OnAnswerCreated", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );

    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );

    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");
    new OnAnswerCreated(inMemoryQuestionRepository, sendNotificationUseCase);
  });

  it("Should send a notification when a new answer is created", async () => {
    const question = makeQuestion({}, new UniqueEntityId("question-01"));
    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionRepository.create(question);
    inMemoryAnswerRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
