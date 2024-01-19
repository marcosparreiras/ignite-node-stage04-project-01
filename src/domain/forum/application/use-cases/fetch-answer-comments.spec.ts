import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: FetchAnswerCommentsUseCase;

describe("FetchAnswerCommentsUseCase", () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository);
  });

  it("Should be able to fetch answer comments", async () => {
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId("answer-01") })
    );
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId("answer-01") })
    );
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId("answer-02") })
    );

    const result = await sut.execute({
      answerId: "answer-01",
      page: 1,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.answerComments).toHaveLength(2);
  });

  it("Should be able to fetch answer comments by page", async () => {
    for (let i = 1; i <= 23; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId("answer-01") })
      );
    }

    const result = await sut.execute({
      answerId: "answer-01",
      page: 2,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.answerComments).toHaveLength(3);
  });
});
