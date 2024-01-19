import { PaginationParams } from "@/core/repositories/Pagination-params";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export interface AnswerRespository {
  create(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
  save(answer: Answer): Promise<void>;
  findManyByQuestionId(
    questionId: string,
    props: PaginationParams
  ): Promise<Answer[]>;
  findById(id: string): Promise<Answer | null>;
}
