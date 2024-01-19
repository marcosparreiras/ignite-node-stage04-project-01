import { Either, right } from "@/core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentRepository.fetchManyByQuestionId(questionId, {
        page,
      });
    return right({ questionComments });
  }
}
