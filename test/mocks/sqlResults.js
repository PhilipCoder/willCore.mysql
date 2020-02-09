const getNewDBSql = `-- DB does not exists, creating DB.
CREATE DATABASE myDB;
USE myDB;
-- Create table.
CREATE TABLE \`user\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create table.
CREATE TABLE \`product\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null,
\`owner\` int null,
INDEX product_owner_user_id(owner),
CONSTRAINT \`fk_product_owner_user_id\` FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`

exports.getNewDBSql = getNewDBSql;

const noChangeSQL = `USE myDB;`;

exports.noChangeSQL = noChangeSQL;

const addTableSQL = `USE myDB;
-- Create table.
CREATE TABLE \`category\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null,
\`description\` varchar(256) null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`

exports.addTableSQL = addTableSQL;

const addColumnsSQL = `USE myDB;
ALTER TABLE user
ADD COLUMN \`dob\` datetime(6) null;

ALTER TABLE product
ADD COLUMN \`description\` varchar(256) null;`;

exports.addColumnsSQL = addColumnsSQL;

const addColumnWithForeignKey = `USE myDB;
ALTER TABLE product
ADD COLUMN \`owner\` int null,
ADD INDEX product_owner_user_id(owner),
ADD CONSTRAINT \`fk_product_owner_user_id\` FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE;`;

exports.addColumnWithForeignKey = addColumnWithForeignKey;

const addForeignKeyToExistingColumn = `USE myDB;
ALTER TABLE product
ADD INDEX product_owner_user_id(owner),
ADD CONSTRAINT \`fk_product_owner_user_id\` FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE;`;

exports.addForeignKeyToExistingColumn = addForeignKeyToExistingColumn;

exports.dropFK = ["ALTER TABLE product DROP FOREIGN KEY `fk_product_owner_user_id`;","ALTER TABLE profile DROP FOREIGN KEY `fk_profile_person_user_id`;"];
exports.dropColumn = ["ALTER TABLE product DROP COLUMN owner;","ALTER TABLE profile DROP COLUMN person;"];

const fullDropCreate = `DROP DATABASE IF EXISTS myDB;
-- DB does not exists, creating DB.
CREATE DATABASE myDB;
USE myDB;
-- Create table.
CREATE TABLE \`user\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create table.
CREATE TABLE \`product\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null,
\`owner\` int null,
INDEX product_owner_user_id(owner),
CONSTRAINT \`fk_product_owner_user_id\` FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create table.
CREATE TABLE \`profile\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null,
\`person\` int null,
INDEX profile_person_user_id(person),
CONSTRAINT \`fk_profile_person_user_id\` FOREIGN KEY (person) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create table.
CREATE TABLE \`productDetails\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null,
\`product\` int null,
INDEX productDetails_product_product_id(product),
CONSTRAINT \`fk_productDetails_product_product_id\` FOREIGN KEY (product) REFERENCES product(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;

exports.fullDropCreate = fullDropCreate;