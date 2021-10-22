import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTransactions1634862501769 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                    {
                        name: "id",
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: "value",
                        type: 'number',
                        isNullable: false,
                    },
                    {
                        name: "type",
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: "category_id",
                        type: 'uuid',
                        isNullable: false,
                    },
                ]
            })
        );

        await queryRunner.createForeignKey('transactions', 
            new TableForeignKey({
                name: 'transactionCategory',
                columnNames: ['category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'categories',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }), 
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('transactions', 'transactionCategory');
        await queryRunner.dropTable('transactions');
    }

}
