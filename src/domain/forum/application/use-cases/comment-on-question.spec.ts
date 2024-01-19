import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { CommentOnQuestion } from "./comment-on-question";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestion;

describe("CommentOnQuestion", () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new CommentOnQuestion(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentRepository
    );
  });

  it("Should be able to comment on question", async () => {
    const newQuestion = makeQuestion({});
    await inMemoryQuestionRepository.create(newQuestion);
    const result = await sut.execute({
      authorId: "author-01",
      questionId: newQuestion.id.toString(),
      content: "Fake Comment",
    });
    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
      "Fake Comment"
    );
  });
});
