import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRankingWeeksAndRankingEntries1560433952751
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "ranking_weeks" (
          "id" SERIAL NOT NULL, 
          "season_number" integer NOT NULL, 
          "week_number" integer NOT NULL, 
          CONSTRAINT "UQ_4c413331a233c7085b330e071f1" UNIQUE ("season_number", "week_number"), 
          CONSTRAINT "PK_651c2971adec5eb8f8d39e21d10" PRIMARY KEY ("id")
        )`
    );
    await queryRunner.query(
      `CREATE TABLE "ranking_entries" (
          "user_id" integer NOT NULL,
          "ranking_week_id" integer NOT NULL,
          "position" integer NOT NULL,
          "points" integer NOT NULL,
          "points_to_defend" integer NOT NULL,
          "won_vs_lost_matches" integer NOT NULL,
          "won_vs_lost_sets" integer NOT NULL,
          "rank_delta" integer NOT NULL, 
          CONSTRAINT "UQ_9e86b7da58c7e1894634a9fdb93" UNIQUE ("user_id", "ranking_week_id", "position"),
          CONSTRAINT "PK_3f2c8de10bc122c7b24d95ad730" PRIMARY KEY ("user_id", "ranking_week_id")
        )`
    );
    await queryRunner.query(
      `ALTER TABLE "tournaments" ADD "ranking_week_id" integer`
    );
    await queryRunner.query(
      `ALTER TABLE "tournaments" ADD CONSTRAINT "FK_89f53d14c872dc05b995952fdcc" FOREIGN KEY ("ranking_week_id") REFERENCES "ranking_weeks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "ranking_entries" ADD CONSTRAINT "FK_191b34c95c3b085007075fc85c2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "ranking_entries" ADD CONSTRAINT "FK_26cde7f5382d7fb4a41be8630b5" FOREIGN KEY ("ranking_week_id") REFERENCES "ranking_weeks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "ranking_entries" DROP CONSTRAINT "FK_26cde7f5382d7fb4a41be8630b5"`
    );
    await queryRunner.query(
      `ALTER TABLE "ranking_entries" DROP CONSTRAINT "FK_191b34c95c3b085007075fc85c2"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournaments" DROP CONSTRAINT "FK_89f53d14c872dc05b995952fdcc"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournaments" DROP COLUMN "ranking_week_id"`
    );
    await queryRunner.query(`DROP TABLE "ranking_entries"`);
    await queryRunner.query(`DROP TABLE "ranking_weeks"`);
  }
}
