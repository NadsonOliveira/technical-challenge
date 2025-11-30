import { Chatbot } from 'src/chatbots/entities/chatbots.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatbotId: string;

  @ManyToOne(() => Chatbot, (chatbot) => chatbot.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatbotId' })
  chatbot: Chatbot;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['user', 'system', 'assistant'],
    default: 'user',
  })
  sender: 'user' | 'system' | 'assistant';

  @Column({ type: 'boolean', default: false })
  isError: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
