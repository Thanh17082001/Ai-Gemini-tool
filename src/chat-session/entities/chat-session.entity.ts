import { Ai } from "src/ai/entities/ai.entity";
import { AbstractEntity } from "src/common/constants/base.entity";
import { Message } from "src/messages/entities/message.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";


@Entity()
export class ChatSession extends AbstractEntity {
    @ManyToOne(() => Ai)
    @JoinColumn({ name: 'code', referencedColumnName: 'code' })
    ai: Ai;

    @Column({ nullable: true })
    title: string;

    @Column({ default: 0 })
    totalTokens: number;

    @OneToMany(() => Message, (msg) => msg.session, { cascade: true })
    messages: Message[];
}
