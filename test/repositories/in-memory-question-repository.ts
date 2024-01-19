import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/Pagination-params";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repostory";
import { QuestionRespository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionRepository implements QuestionRespository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: QuestionAttachmentRepository
  ) {}

  async create(question: Question) {
    this.items.push(question);
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id);
    this.items[index] = question;
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    this.items = this.items.filter((item) => item.id !== question.id);
    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);
    return questions;
  }

  async findById(questionId: string) {
    const question = this.items.find(
      (item) => item.id.toString() === questionId
    );
    return question ?? null;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);
    return question ?? null;
  }
}
