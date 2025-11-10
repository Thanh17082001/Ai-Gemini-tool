import { AbstractEntity } from "src/common/constants/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class AiClient extends AbstractEntity {

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    secretKey: string;

    @Column({ default: true })
    active: boolean;
}
