import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DocumentEntity } from '../../documents/entities/document.entity';

@Entity('embeddings')
export class EmbeddingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  chunk: string;

  @Column({ type: 'float', array: true })
  vector: number[];

  @Column()
  documentId: string;

  @ManyToOne(() => DocumentEntity, (doc) => doc.embeddings, {
    onDelete: 'CASCADE',
  })
  document: DocumentEntity;

  @Column({ type: 'int' })
  chunkIndex: number;

  @Column({ default: () => 'NOW()' })
  createdAt: Date;
}
