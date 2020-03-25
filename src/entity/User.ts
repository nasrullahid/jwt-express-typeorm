import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity('user', { schema: 'dev_coid' })
@Unique(["username"])
@Unique(["email"])
@Unique(["phone"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 100)
  fullname: string;

  @Column()
  @Length(4, 20)
  username: string;

  @Column()
  @Length(4, 100)
  email: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column()
  @Length(4, 100)
  city: string;

  @Column()
  @Length(8, 12)
  phone: string;

  @Column()
  @Length(4, 100)
  collage: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @IsNotEmpty()
  active: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
