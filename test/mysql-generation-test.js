const assert = require('chai').assert;
const willCoreProxy = require("willcore.core");
const db = require("../sqlGeneration/components/mysql/db.js");
const table = require("../sqlGeneration/components/mysql/table.js");
const column = require("../sqlGeneration/components/mysql/column.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");

describe('mysql-generation-test', function () {
   migrationSetup.migrationTablesEnabled = false;
   let dbName = "testDB", connectionString = "myConnection", userName = "myUser", password = "myPassword", tableName = "testTable";
   //---------------------------------------------------
   it('create-db', function () {
      let proxy = willCoreProxy.new();
      proxy.myDB.mysql = [connectionString, userName, password];

      let sqlCreator = new db(proxy.myDB._assignable.dbInfo);
      let sql = sqlCreator.getSQL();
      assert(sql === "-- DB does not exists, creating DB.\nCREATE DATABASE myDB;\nUSE myDB;",sql)
   });

   it('create-table-no-columns', function () {
      let proxy = willCoreProxy.new();
      proxy.myDB.mysql = [connectionString, userName, password];
      proxy.myDB.product.table;

      let sqlCreator = new table(proxy.myDB.product._assignable.tableInfo);
      let sql = sqlCreator.getSQL();
      assert(sql === "")
   });

   it('sql-type-generation-int', function () {
      let col = new column();
      let sqlType = col.getSQLType("int");
      assert(sqlType === "int");
   });

   it('sql-type-generation-int-sized', function () {
      let col = new column();
      let sqlType = col.getSQLType("int", 11);
      assert(sqlType === "int(11)");
   });

   it('sql-type-generation-string', function () {
      let col = new column();
      let sqlType = col.getSQLType("string");
      assert(sqlType === "varchar(256)");
   });

   it('sql-type-generation-string-sized', function () {
      let col = new column();
      let sqlType = col.getSQLType("string", 20);
      assert(sqlType === "varchar(20)");
   });

   it('sql-type-generation-decimal', function () {
      let col = new column();
      let sqlType = col.getSQLType("decimal");
      assert(sqlType === "decimal(20,7)");
   });

   it('sql-type-generation-decimal-sized', function () {
      let col = new column();
      let sqlType = col.getSQLType("decimal", [4, 3]);
      assert(sqlType === "decimal(4,3)");
   });

   it('sql-type-generation-float', function () {
      let col = new column();
      let sqlType = col.getSQLType("float");
      assert(sqlType === "float(20,7)");
   });

   it('sql-type-generation-float-sized', function () {
      let col = new column();
      let sqlType = col.getSQLType("float", [4, 3]);
      assert(sqlType === "float(4,3)");
   });
   it('sql-type-generation-date', function () {
      let col = new column();
      let sqlType = col.getSQLType("date");
      assert(sqlType === "datetime(6)");
   });

   it('sql-type-generation-date-sized', function () {
      let col = new column();
      let sqlType = col.getSQLType("date", 7);
      assert(sqlType === "datetime(7)");
   });

   it('sql-type-generation-bool', function () {
      let col = new column();
      let sqlType = col.getSQLType("bool");
      assert(sqlType === "boolean");
   });
   it('sql-column', function () {
      let proxy = willCoreProxy.new();
      proxy.myDB.mysql = [connectionString, userName, password];
      proxy.myDB.product.table;
      proxy.myDB.product.name.column.string;
      let col = new column(proxy.myDB.product.name._assignable.columnInfo);
      let sqlType = col.getSQL();
      assert(sqlType === "`name` varchar(256) null");
   });
   it('sql-column-primary', function () {
      let proxy = willCoreProxy.new();
      proxy.myDB.mysql = [connectionString, userName, password];
      proxy.myDB.product.table;
      proxy.myDB.product.id.column.int;
      proxy.myDB.product.id.primary;
      let col = new column(proxy.myDB.product.id._assignable.columnInfo);
      let sqlType = col.getSQL();
      assert(sqlType === "`id` int AUTO_INCREMENT PRIMARY KEY");
   });

   it('sql-table-columns', function () {
      let proxy = willCoreProxy.new();
      proxy.myDB.mysql = [connectionString, userName, password];
      proxy.myDB.product.table;
      proxy.myDB.product.id.column.int;
      proxy.myDB.product.id.primary;
      proxy.myDB.product.name.column.string;
      proxy.myDB.product.audit.column.date;
      let col = new table(proxy.myDB.product._assignable.tableInfo);
      let sqlType = col.getSQL();
      assert(sqlType === `
-- Create table.
CREATE TABLE \`product\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null,
\`audit\` datetime(6) null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`);
   });

   it('sql-table-foreign-key', function () {
      let proxy = willCoreProxy.new();
      proxy.myDB.mysql = [connectionString, userName, password];

      proxy.myDB.category.table;
      proxy.myDB.category.id.column.int;
      proxy.myDB.category.id.primary;
      proxy.myDB.category.name.column.string;
      proxy.myDB.category.description.column.string;

      proxy.myDB.product.table;
      proxy.myDB.product.id.column.int;
      proxy.myDB.product.id.primary;
      proxy.myDB.product.categoryId.column.int;
      proxy.myDB.product.categoryId = proxy.myDB.category.id;
      proxy.myDB.product.name.column.string;
      proxy.myDB.product.audit.column.date;

      let sql = new table(proxy.myDB.product._assignable.tableInfo).getSQL();
   });

   it('test-db-create-sql', function () {
      let proxy = willCoreProxy.new();
      proxy.myDB.mysql = [connectionString, userName, password];
      proxy.myDB.user.table;
      proxy.myDB.user.id.column.int;
      proxy.myDB.user.id.primary;
      proxy.myDB.user.name.column.string;

      proxy.myDB.product.table;
      proxy.myDB.product.id.column.int;
      proxy.myDB.product.id.primary;
      proxy.myDB.product.name.column.string;
      proxy.myDB.product.owner.column.int;
      proxy.myDB.product.owner = proxy.myDB.user.id;

      let sqlCreator = new db(proxy.myDB._assignable.dbInfo);
      let sql = sqlCreator.getSQL();
   });
});