import { Either, left, right } from "@/core/either";
import { AnswerRespository } from "../repositories/answers-respository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";

interface DeleteAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRespository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    await this.answerRepository.delete(answer);
    return right({});
  }
}
