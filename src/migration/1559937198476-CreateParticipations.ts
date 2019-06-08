import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateParticipations1559937198476 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "participations" ("user_id" integer NOT NULL, "challonge_id" integer NOT NULL, "tournament_id" integer NOT NULL, CONSTRAINT "PK_39e31325bbcb7053b41b95669df" PRIMARY KEY ("user_id", "challonge_id", "tournament_id"))`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "challonge_id"`);
    await queryRunner.query(
      `ALTER TABLE "participations" ADD CONSTRAINT "FK_db064f688ab0c9d3d29ff65dcd0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "participations" DROP CONSTRAINT "FK_db064f688ab0c9d3d29ff65dcd0"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "challonge_id" integer NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "participations"`);
  }
}
