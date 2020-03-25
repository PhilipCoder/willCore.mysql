const assert = require('chai').assert;
const willCoreProxy = require("willcore.core");
const migrationComparitor = require("../sqlGeneration/migration/migrationComparitor.js");
const dbStatus = require("../sqlGeneration/migration/statusEnum.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");

describe('mysql-comparison-test', function () {
    let proxy = null;
    before(function () {
        migrationSetup.migrationTablesEnabled = false;
        proxy = willCoreProxy.new();
        proxy.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxy.baseDB.user.table;
        proxy.baseDB.user.id.column.int;
        proxy.baseDB.user.id.primary;
        proxy.baseDB.user.name.column.string;
    
        proxy.baseDB.product.table;
        proxy.baseDB.product.id.column.int;
        proxy.baseDB.product.id.primary;
        proxy.baseDB.product.name.column.string;
        proxy.baseDB.product.owner.column.int;
        proxy.baseDB.product.owner = proxy.baseDB.user.id;
    });
    it('test-no-changes', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.id;

        let comparisonResult = migrationComparitor.runMigrationComparison(
            proxy.baseDB._assignable.dbInfo,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 2);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 5);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 0);
    });

    it('test-create-new', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.id;

        let comparisonResult = migrationComparitor.runMigrationComparison(
            undefined,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 2);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 5);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 0);
    });
    it('test-add-table', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;

        proxyScoped.baseDB.store.table;
        proxyScoped.baseDB.store.id.column.int;
        proxyScoped.baseDB.store.id.primary;
        proxyScoped.baseDB.store.name.column.string;
        proxyScoped.baseDB.store.owner.column.int;

        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.id;

       let comparisonResult = migrationComparitor.runMigrationComparison(
            proxy.baseDB._assignable.dbInfo,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 3);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 2);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 5);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 0);
    });
    it('test-type-change', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.int;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.id;

        let comparisonResult = migrationComparitor.runMigrationComparison(
            proxy.baseDB._assignable.dbInfo,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 4);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 0);
    });
    it('test-reference-change', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.name;

        let comparisonResult = migrationComparitor.runMigrationComparison(
            proxy.baseDB._assignable.dbInfo,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 4);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 1);
    });
    it('test-reference-add', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.name;
        proxyScoped.baseDB.product.name = proxyScoped.baseDB.user.name;

        let comparisonResult = migrationComparitor.runMigrationComparison(
            proxy.baseDB._assignable.dbInfo,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 3);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 1);
    });
    it('test-reference-remove', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;

        let comparisonResult = migrationComparitor.runMigrationComparison(
            proxy.baseDB._assignable.dbInfo,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 4);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 0);
    });
    it('test-columns-remove', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;

        let comparisonResult = migrationComparitor.runMigrationComparison(
            proxy.baseDB._assignable.dbInfo,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 0);
        assert(getColumnsWithStatus(comparisonResult.source, dbStatus.deleted).length === 2);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 2);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 3);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 0);
    });
    it('test-table-column-remove', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;

        let comparisonResult = migrationComparitor.runMigrationComparison(
            proxy.baseDB._assignable.dbInfo,
            proxyScoped.baseDB._assignable.dbInfo);

        assert(getTablesWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.new).length === 0);
        assert(getTablesWithStatus(comparisonResult.source, dbStatus.deleted).length === 1);
        assert(getColumnsWithStatus(comparisonResult.source, dbStatus.deleted).length === 1);
        assert(getTablesWithStatus(comparisonResult.target, dbStatus.skip).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.skip).length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.typeChanged).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.addReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.removeReference).length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, dbStatus.changeReference).length === 0);
    });
    it('test-db-comparison-obj-copy', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
  
        proxy.myDB.product.table;
        proxy.myDB.product.id.column.int;
        proxy.myDB.product.id.primary;
        proxy.myDB.product.name.column.string;
        proxy.myDB.product.owner.column.int;
  
        let originalConf = proxy.myDB._assignable.dbInfo;
        let copyConf = migrationComparitor.getDBCopyObj(originalConf);
  
        copyConf.tables.product.columns.name.test = 4;
        assert(proxy.myDB.product.name._assignable.columnInfo.test === undefined);
     });
    
});

function getTablesWithStatus(dbInfo, status) {
    return dbInfo && dbInfo.tableList ? dbInfo.tableList.filter(x => x.status === status) : [];
}

function getColumnsWithStatus(dbInfo, status) {
    return dbInfo.tableList.reduce((accumulator, table)=>{
        table.columnList.forEach(col=>{
            accumulator.push(col);
        });
        return accumulator;
    },[]).filter(x => x.status === status);
}