import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: GetQuestionBySlugUseCase;

describe("GetQuestionBySlugUseCase", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to get a question by slug", async () => {
    const newQuestion = makeQuestion({ slug: Slug.create("fake-question") });
    inMemoryQuestionRepository.create(newQuestion);
    const result = await sut.execute({ slug: "fake-question" });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionRepository.items[0].id).toEqual(newQuestion.id);
  });

  it("Should not be possible to seacrh an nonexistent question", async () => {
    const result = await sut.execute({ slug: "fake-question" });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
