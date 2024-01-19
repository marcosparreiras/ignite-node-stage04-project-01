import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/Pagination-params";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attchment-repository";
import { AnswerRespository } from "@/domain/forum/application/repositories/answers-respository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswerRepository implements AnswerRespository {
  public items: Answer[] = [];

  constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}

  async create(answer: Answer) {
    this.items.push(answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    this.items = this.items.filter((item) => item.id !== answer.id);
    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);
    return answers;
  }

  async save(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id);
    this.items[index] = answer;
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);
    return answer ?? null;
  }
}
