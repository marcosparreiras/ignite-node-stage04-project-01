import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: DeleteQuestionCommentUseCase;

describe("DeleteQuestionCommentUseCase", () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository);
  });

  it("Should be able to delete a question comment", async () => {
    const newQuestionComment = makeQuestionComment({});
    await inMemoryQuestionCommentRepository.create(newQuestionComment);
    const result = await sut.execute({
      authroId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete another user question comment", async () => {
    const newQuestionComment = makeQuestionComment({});
    await inMemoryQuestionCommentRepository.create(newQuestionComment);
    const result = await sut.execute({
      authroId: "author-01",
      questionCommentId: newQuestionComment.id.toString(),
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
