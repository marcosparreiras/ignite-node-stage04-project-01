import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionRespository } from "../repositories/question-repository";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface CommentOnQuestionRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestion {
  constructor(
    private questionRepository: QuestionRespository,
    private questionCommentRepository: QuestionCommentRepository
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      return left(new ResourceNotFoundError());
    }
    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: question.id,
      content,
    });

    await this.questionCommentRepository.create(questionComment);

    return right({ questionComment });
  }
}
