import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndicesToRankingEntries1560522879167
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE INDEX "IDX_191b34c95c3b085007075fc85c" ON "ranking_entries" ("user_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_26cde7f5382d7fb4a41be8630b" ON "ranking_entries" ("ranking_week_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_26cde7f5382d7fb4a41be8630b"`);
    await queryRunner.query(`DROP INDEX "IDX_191b34c95c3b085007075fc85c"`);
  }
}
