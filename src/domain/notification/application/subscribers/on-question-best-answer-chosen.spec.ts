import { makeAnswer } from "test/factories/make-answer";
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
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";

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

describe("OnQuestionBestAnswerChosen", () => {
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
    new OnQuestionBestAnswerChosen(
      inMemoryAnswerRepository,
      sendNotificationUseCase
    );
  });

  it("Should send a notification when a question best answer is chosen", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionRepository.create(question);
    inMemoryAnswerRepository.create(answer);
    question.bestAnswerId = answer.id;
    inMemoryQuestionRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
