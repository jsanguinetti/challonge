import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UserMigration1517440514104 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'int', isPrimary: true },
                { name: 'external_id', type: 'varchar', isNullable: false, isUnique: true },
                { name: 'external_username', type: 'varchar', isNullable: false, isUnique: true },
                { name: 'challonge_username', type: 'varchar', isNullable: false },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('users');
    }

}
