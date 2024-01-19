import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: FetchQuestionAnswersUseCase;

describe("FetchRecentAnswersUseCase", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
  });

  it("Should be able to fetch answers by question id", async () => {
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-01") })
    );
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-01") })
    );
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-02") })
    );

    const result = await sut.execute({
      questionId: "question-01",
      page: 1,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.answers).toHaveLength(2);
    expect(result.value?.answers[0].questionId.toString()).toEqual(
      "question-01"
    );
  });

  it("Should be able tto fetch question answers by page", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({ questionId: new UniqueEntityId("question-01") })
      );
    }

    const result = await sut.execute({
      questionId: "question-01",
      page: 2,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.answers).toHaveLength(2);
  });
});
