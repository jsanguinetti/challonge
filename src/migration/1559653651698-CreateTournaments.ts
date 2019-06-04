import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTournaments1559653651698 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "tournaments" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "challonge_id" integer NOT NULL,
                "challonge_id_alias" character varying NOT NULL,
                "full_challonge_url" character varying NOT NULL,
                "game_name" character varying NOT NULL,
                "create_date" TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
                "update_date" TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
                CONSTRAINT "PK_6d5d129da7a80cf99e8ad4833a9" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "tournaments"`);
    }

}
