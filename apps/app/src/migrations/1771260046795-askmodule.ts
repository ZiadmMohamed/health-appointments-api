import { MigrationInterface, QueryRunner } from 'typeorm';

export class Askmodule1771260046795 implements MigrationInterface {
  name = 'Askmodule1771260046795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "asks" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "question" text NOT NULL, "patient_id" integer, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7bad5704595ce0e1972b349dc3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "created_at"`);
    await queryRunner.query(`DROP TABLE "asks"`);
  }
}
