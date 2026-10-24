import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStarredAndPosition1792251584197 implements MigrationInterface {
    name = 'AddStarredAndPosition1792251584197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" ADD "starred" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "position" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "starred"`);
    }

}
