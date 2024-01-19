import { PaginationParams } from "@/core/repositories/Pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentRepository {
  create(answerComment: AnswerComment): Promise<void>;
  delete(answerComment: AnswerComment): Promise<void>;
  findById(answerCommentId: string): Promise<AnswerComment | null>;
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>;
}
