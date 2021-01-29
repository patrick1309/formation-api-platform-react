<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210106193422 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_object (id INT AUTO_INCREMENT NOT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE customer ADD picture_id INT DEFAULT NULL, DROP picture');
        $this->addSql('ALTER TABLE customer ADD CONSTRAINT FK_81398E09EE45BDBF FOREIGN KEY (picture_id) REFERENCES media_object (id)');
        $this->addSql('CREATE INDEX IDX_81398E09EE45BDBF ON customer (picture_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE customer DROP FOREIGN KEY FK_81398E09EE45BDBF');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP INDEX IDX_81398E09EE45BDBF ON customer');
        $this->addSql('ALTER TABLE customer ADD picture VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, DROP picture_id');
    }
}
