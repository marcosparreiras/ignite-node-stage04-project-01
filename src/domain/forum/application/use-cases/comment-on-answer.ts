import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerRespository } from "../repositories/answers-respository";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface CommentOnAnswerRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswer {
  constructor(
    private answerRepository: AnswerRespository,
    private answerCommentRepository: AnswerCommentRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: answer.id,
      content,
    });

    await this.answerCommentRepository.create(answerComment);

    return right({ answerComment });
  }
}
