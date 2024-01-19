import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { CreateQuestionUseCase } from "./create-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: CreateQuestionUseCase;

describe("CreateQuestionUseCase", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "01",
      title: "Fake Question",
      content: "Fake content...",
      attatchmentsIds: ["attatchment-01", "attatchment-02"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question);
    expect(
      inMemoryQuestionRepository.items[0].attachments.getItems()
    ).toHaveLength(2);
    expect(inMemoryQuestionRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({
        attatchmentId: new UniqueEntityId("attatchment-01"),
      }),
      expect.objectContaining({
        attatchmentId: new UniqueEntityId("attatchment-02"),
      }),
    ]);
  });
});
