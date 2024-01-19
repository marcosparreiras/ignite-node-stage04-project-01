import { PaginationParams } from "@/core/repositories/Pagination-params";
import { Question } from "../../enterprise/entities/question";

export interface QuestionRespository {
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
  save(question: Question): Promise<void>;
  findManyRecent(params: PaginationParams): Promise<Question[]>;
  findById(questionId: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
}
