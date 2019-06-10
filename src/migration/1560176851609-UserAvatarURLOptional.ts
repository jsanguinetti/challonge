import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAvatarURLOptional1560176851609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "challonge_avatar_url" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "challonge_avatar_url" SET NOT NULL`
    );
  }
}
