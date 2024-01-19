import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";

export function makeAnswerAttachment(
  overide: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId
) {
  return AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...overide,
    },
    id
  );
}
