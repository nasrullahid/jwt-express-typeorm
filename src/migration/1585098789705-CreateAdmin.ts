import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../entity/User";

export class CreateAdmin1585098789705 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.fullname = "Administrator";
        user.username = "admin";
        user.email = "admin@cpnsonline.id";
        user.password = "paswd@admin";
        user.hashPassword();
        user.city = "Makassar";
        user.phone = "082337027237";
        user.collage = "Universitas Negeri Makassar";
        user.role = "ADMIN";
        user.active = 1;
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
