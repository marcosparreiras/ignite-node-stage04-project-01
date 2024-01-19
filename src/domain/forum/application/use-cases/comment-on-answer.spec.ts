import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { CommentOnAnswer } from "./comment-on-answer";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: CommentOnAnswer;

describe("CommentOnAnswer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new CommentOnAnswer(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository
    );
  });

  it("Should be able to comment on answer", async () => {
    const newAnswer = makeAnswer({});
    await inMemoryAnswerRepository.create(newAnswer);
    const result = await sut.execute({
      authorId: "author-01",
      answerId: newAnswer.id.toString(),
      content: "Fake Comment",
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryAnswerCommentRepository.items[0].content).toEqual(
      "Fake Comment"
    );
  });
});
