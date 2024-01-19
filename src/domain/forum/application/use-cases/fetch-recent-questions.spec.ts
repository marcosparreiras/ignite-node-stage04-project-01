import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: FetchRecentQuestionsUseCase;

describe("FetchRecentQuestionsUseCase", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to fetch the most recent questions", async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 2) })
    );
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 1) })
    );
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 3) })
    );

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.questions).toHaveLength(3);
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 3) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 2) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 1) }),
    ]);
  });

  it("Should be able to fetch the most recent questions by page", async () => {
    for (let i = 1; i <= 44; i++) {
      await inMemoryQuestionRepository.create(
        makeQuestion({
          createdAt: new Date(2023, Math.floor(i / 25), (i % 25) + 1),
        })
      );
    }

    const result = await sut.execute({ page: 2 });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.questions).toHaveLength(20);
    expect(result.value?.questions[0]).toEqual(
      expect.objectContaining({ createdAt: new Date(2023, 0, 25) })
    );
  });
});
