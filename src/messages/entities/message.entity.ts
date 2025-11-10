import { ChatSession } from "src/chat-session/entities/chat-session.entity";
import { AbstractEntity } from "src/common/constants/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Message extends AbstractEntity {

    @ManyToOne(() => ChatSession, (session) => session.messages, { onDelete: 'CASCADE' })
    session: ChatSession;

    @Column({ type: 'varchar', length: 20, default: 'user' })
    role: string;

    @Column({ type: 'text' })
    content: string; // nội dung message

    @Column({ type: 'int', default: 0 })
    tokenCount: number; // số token ước tính hoặc thực tế
}
