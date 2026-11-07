import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenVersion1793000000000
  implements MigrationInterface
{
  name = 'AddRefreshTokenVersion1793000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refreshTokenVersion" integer NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "refreshTokenVersion"`,
    );
  }
}
