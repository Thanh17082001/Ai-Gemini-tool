import { AbstractEntity } from "src/common/constants/base.entity";
import { Column, Entity, Index } from "typeorm";


@Entity()
export class Ai extends AbstractEntity {
    @Index() 
    @Column({ type: "text" , unique: true,  nullable: false })
    code:string;

    @Index() 
    @Column({ type: 'text', unique: true, select: false })
    key: string;

    @Column({ type: 'text', unique: false, nullable: true })
    shool: string;

    @Column({ type: 'text', nullable: true })
    model: string = 'gemini-2.5-flash';

}
