import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveExternalUsername1559827393421 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "external_username"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "external_username" character varying`
    );
  }
}
