const assert = require('chai').assert;
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const status = require("../sqlGeneration/migration/statusEnum.js");
const sqlResults = require("./mocks/sqlResults.js");
const db = require("../sqlGeneration/components/mysql/db.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const runQuery = require("../sqlExecutor/runQuery.js");
describe('mysql-dbGenerator-test', function () {
    migrationSetup.migrationTablesEnabled = false;
    it('test-get-comparison-info', async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.defaultTwoTableDBFactory());
        await dbGenerator.updateTargets();
        assert(dbGenerator.getTablesWithStatus(status.skip).length === 2);
        rewiremock.disable();
    });
    it('test-get-new-db-sql', async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.defaultTwoTableDBFactory());
        await dbGenerator.updateTargets();
        assert(dbGenerator.sql === sqlResults.getNewDBSql, "New DB sql incorrect");
        rewiremock.disable();
    });
    it('test-no-changes', async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.defaultTwoTableDBFactory());
        await dbGenerator.updateTargets();
        assert(dbGenerator.sql === sqlResults.noChangeSQL, "No change sql incorrect");
        rewiremock.disable();
    });
    it('add-table-test', async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.addtableDBFactory());
        await dbGenerator.updateTargets();
        assert(dbGenerator.sql === sqlResults.addTableSQL, "Add table sql incorrect");
        rewiremock.disable();
    });
    it('add-column-test', async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.addColumnDBFactory());
        await dbGenerator.updateTargets();
        assert(dbGenerator.sql === sqlResults.addColumnsSQL, "Add column sql incorrect");
        rewiremock.disable();
    });
    it('add-column-foreign-key-test', async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceNoFKStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.addFKDBFactory());
        await dbGenerator.updateTargets();
        assert(dbGenerator.sql === sqlResults.addColumnWithForeignKey, "No change sql incorrect");
        rewiremock.disable();
    });
    it('add-foreign-key-test',async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceNoFKColStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.addColumnFKDBFactory());
        await dbGenerator.updateTargets();
        assert(dbGenerator.sql === sqlResults.addForeignKeyToExistingColumn, "No change sql incorrect");
        rewiremock.disable();
    });
    it('drop-columns-get-column-fk-test',async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceMultipuleFKStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.defaultTwoTableDBFactory());
        await dbGenerator.updateTargets();
        const dbCodeGen = new db(dbGenerator.comparisonTarget, dbGenerator.comparisonSource);
        const idRef = dbCodeGen.getForeignKeysForColumn("user", "id");
        const productRef = dbCodeGen.getForeignKeysForColumn("profile", "person");
        assert(idRef.length === 2, "Foreign keys not found");
        assert(productRef.length === 1, "Foreign keys not found");
        rewiremock.disable();
    });

    it('drop-columns-get-table-fk-test', async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceMultipuleFKStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.defaultTwoTableDBFactory());
        await dbGenerator.updateTargets();
        const dbCodeGen = new db(dbGenerator.comparisonTarget, dbGenerator.comparisonSource);
        const idRef = dbCodeGen.getForeignKeysForTable("user");
        const productRef = dbCodeGen.getForeignKeysForTable("profile");
        assert(idRef.length === 2, "Foreign keys not found");
        assert(productRef.length === 1, "Foreign keys not found");
        rewiremock.disable();
    });
    it('get-deleted-columns-test',async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceMultipuleFKStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.dropColumns());
        await dbGenerator.updateTargets();
        const dbCodeGen = new db(dbGenerator.comparisonTarget, dbGenerator.comparisonSource);
        const deletedColumns = dbCodeGen.getDeletedColumns();
        assert(deletedColumns.length === 2, "Deleted columns not detected.");
        rewiremock.disable();
    });
    it('get-deleted-columns-sql-test',async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceManyFKStub);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.dropFK());
        let sql = dbGenerator.sql;

        rewiremock.disable();
    });
    it('full-db-create-drop-test',async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.manyFKCreateDB());
        dbGenerator.dropDB = true;
        let sql = dbGenerator.sql;
        assert(sql === sqlResults.fullDropCreate);
        rewiremock.disable();
    });
    it('full-db-create-drop-execute-test', async function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.manyFKCreateDB());
        dbGenerator.dropDB = true;
        let sql = dbGenerator.sql;
       // await dbGenerator.generateDB();
        assert(sql === sqlResults.fullDropCreate);
        rewiremock.disable();
    });
    it('db-create-with-migration-test', async function () {
        this.timeout(10000);
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.manyFKCreateDB(),new runQuery("127.0.0.1","root","mySQLPassword01","mydb"));
        dbGenerator.dropDB = true;
        await dbGenerator.generateDB("the one").catch(ex=>{
            console.log(ex);
        });
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
    });

    it('db-create-with-save', async function () {
        this.timeout(10000);
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        let myDB = mocks.manyFKCreateDB();
        await myDB.init(true);
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
    });
});