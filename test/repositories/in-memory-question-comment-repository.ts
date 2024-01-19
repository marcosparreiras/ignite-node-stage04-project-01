import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/Pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = [];

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async delete(questionComment: QuestionComment) {
    this.items = this.items.filter((item) => item.id !== questionComment.id);
  }

  async findById(questionCommentId: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === questionCommentId
    );
    return questionComment ?? null;
  }

  async fetchManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);
    return questionComments;
  }
}
