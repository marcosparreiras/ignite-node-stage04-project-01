import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: FetchQuestionCommentsUseCase;

describe("FetchQuestionCommentsUseCase", () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository);
  });

  it("Should be able to fetch question comments", async () => {
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-01") })
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-01") })
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-02") })
    );

    const result = await sut.execute({
      page: 1,
      questionId: "question-01",
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.questionComments).toHaveLength(2);
  });

  it("Should be able to fetch question comments by page", async () => {
    for (let i = 1; i <= 23; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId("question-01") })
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: "question-01",
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.questionComments).toHaveLength(3);
  });
});
