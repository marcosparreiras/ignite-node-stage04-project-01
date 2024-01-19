import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerRespository } from "../repositories/answers-respository";
import { Either, right } from "@/core/either";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

export class AnswerQuestionUseCase {
  constructor(private answerRespository: AnswerRespository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachment) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityId(attachment),
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRespository.create(answer);
    return right({ answer });
  }
}
