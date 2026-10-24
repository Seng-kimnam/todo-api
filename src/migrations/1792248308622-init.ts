import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1792248308622 implements MigrationInterface {
    name = 'Init1792248308622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "username" character varying(100) NOT NULL, "displayName" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
