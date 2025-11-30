import { Chatbot } from 'src/chatbots/entities/chatbots.entity';
import { EmbeddingEntity } from 'src/embeddings/entities/embedding.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  filename: string;

  @Column({ nullable: true })
  textContent?: string;

  @Column({ default: false })
  processed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Chatbot, (chatbot) => chatbot.documents, {
    onDelete: 'CASCADE',
  })
  chatbot: Chatbot;

  @OneToMany(() => EmbeddingEntity, (emb) => emb.document)
  embeddings: EmbeddingEntity[];

  @Column()
  chatbotId: string;
}
