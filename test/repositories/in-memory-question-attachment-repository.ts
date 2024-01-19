import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repostory";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId
    );
    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId
    );
  }
}
