import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  AnswerComment,
  AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { faker } from "@faker-js/faker";

export function makeAnswerComment(
  overide: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId
) {
  return AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...overide,
    },
    id
  );
}
