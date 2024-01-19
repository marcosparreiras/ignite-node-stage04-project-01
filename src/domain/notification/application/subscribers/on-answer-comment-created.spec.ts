import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { OnAnswerCommentCreated } from "./on-answer-comment-created";
import { SpyInstance } from "vitest";
import { makeAnswer } from "test/factories/make-answer";
import { waitFor } from "test/utils/wait-for";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("OnAnswerCommentCreated", () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();

    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );

    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");
    new OnAnswerCommentCreated(
      inMemoryAnswerRepository,
      sendNotificationUseCase
    );
  });

  it("Should be able to send notification after a answer comment is create", async () => {
    const answer = makeAnswer({}, new UniqueEntityId("answer-01"));
    await inMemoryAnswerRepository.create(answer);

    const answerComment = makeAnswerComment({ answerId: answer.id });
    await inMemoryAnswerCommentRepository.create(answerComment);

    waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
