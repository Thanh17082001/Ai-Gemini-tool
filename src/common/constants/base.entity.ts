
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Generated, Column, ManyToOne, JoinColumn, Entity, BaseEntity } from 'typeorm';
@Entity()
export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    public id: number;


    @Generated('uuid') // Tạo UUID tự động
    @Column()
    public uuid: string;

    @Column({default: true})
    public isActive: boolean;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt?: Date; // Xóa mềm
}