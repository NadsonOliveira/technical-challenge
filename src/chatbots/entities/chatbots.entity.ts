import { DocumentEntity } from 'src/documents/entities/document.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('chatbots')
export class Chatbot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => DocumentEntity, (document) => document.chatbot)
  documents: DocumentEntity[];

  @OneToMany(() => MessageEntity, (message) => message.chatbot)
  messages: MessageEntity[];
}
