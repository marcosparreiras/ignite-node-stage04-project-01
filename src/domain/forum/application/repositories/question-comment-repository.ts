import { PaginationParams } from "@/core/repositories/Pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";

export interface QuestionCommentRepository {
  create(questionComment: QuestionComment): Promise<void>;
  findById(questionCommentId: string): Promise<QuestionComment | null>;
  fetchManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>;
  delete(questionComment: QuestionComment): Promise<void>;
}
