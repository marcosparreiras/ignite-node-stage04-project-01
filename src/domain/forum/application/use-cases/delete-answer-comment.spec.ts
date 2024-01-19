import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: DeleteAnswerCommentUseCase;

describe("DeleteAnswerCommentUseCase", () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository);
  });

  it("Should be able to delete an answer comment", async () => {
    const answerComment = makeAnswerComment({});
    await inMemoryAnswerCommentRepository.create(answerComment);
    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete another user answer comment", async () => {
    const answerComment = makeAnswerComment({});
    await inMemoryAnswerCommentRepository.create(answerComment);
    const response = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: "author-01",
    });
    expect(response.isLeft()).toEqual(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
