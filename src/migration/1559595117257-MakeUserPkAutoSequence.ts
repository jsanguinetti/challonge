import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUserPkAutoSequence1559595117257 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE SEQUENCE "users_id_seq" OWNED BY "users"."id"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`
    );
    await queryRunner.query(`DROP SEQUENCE "users_id_seq"`);
  }
}
