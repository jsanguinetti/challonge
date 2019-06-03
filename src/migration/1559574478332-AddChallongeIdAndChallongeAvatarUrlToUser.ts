import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddChallongeIdAndChallongeAvatarUrlToUser1559574478332 implements MigrationInterface {

    TABLE_COLUMNS = [new TableColumn({
        name: 'challonge_id',
        type: 'int',
        isNullable: false,
    }), new TableColumn({
        name: 'challonge_avatar_url',
        type: 'varchar'
    })]

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('users', this.TABLE_COLUMNS);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns('users', this.TABLE_COLUMNS);
    }

}
