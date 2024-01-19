import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionComment,
  QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { faker } from "@faker-js/faker";

export function makeQuestionComment(
  overide: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId
) {
  return QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...overide,
    },
    id
  );
}
