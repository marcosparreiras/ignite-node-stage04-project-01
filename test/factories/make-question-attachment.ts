import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";

export function makeQuestionAttachment(
  overide: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId
) {
  return QuestionAttachment.create(
    {
      attatchmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...overide,
    },
    id
  );
}
