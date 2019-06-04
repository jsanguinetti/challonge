import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNotNullConstraintOnUsers1559670503426 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tournaments" ALTER COLUMN "create_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tournaments" ALTER COLUMN "update_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_username" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_username" SET NOT NULL`);
    }

}
