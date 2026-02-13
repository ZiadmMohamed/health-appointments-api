import { MigrationInterface, QueryRunner } from 'typeorm';

export class Article1771009254359 implements MigrationInterface {
  name = 'Article1771009254359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "created_at"`);
  }
}
