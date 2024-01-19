import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/Pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = [];

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async delete(answerComment: AnswerComment) {
    this.items = this.items.filter((item) => item.id !== answerComment.id);
  }

  async findById(answerCommentId: string) {
    const answerComment = this.items.find(
      (item) => item.id.toString() === answerCommentId
    );
    return answerComment ?? null;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);
    return answerComments;
  }
}
