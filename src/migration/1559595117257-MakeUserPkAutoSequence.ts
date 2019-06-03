import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUserPkAutoSequence1559595117257 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE SEQUENCE "users_id_seq" OWNED BY "users"."id"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq')`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_11fc776e0ca3573dc195670f636"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_631cd2eef46a52f6eca46114798"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_631cd2eef46a52f6eca46114798" UNIQUE ("external_username")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_11fc776e0ca3573dc195670f636" UNIQUE ("external_id")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "users_id_seq"`);
    }

}
