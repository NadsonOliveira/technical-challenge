import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chatbots')
export class Chatbots {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
