const assert = require('chai').assert;
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const queryFactory = require("../sqlGeneration/queries/queryFactory.js");
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const selectGenerator = require("../sqlGeneration/sqlGenerator/selectGenerator.js");
const joinGenerator = require("../sqlGeneration/sqlGenerator/joinGenerator.js");
const whereGenerator = require("../sqlGeneration/sqlGenerator/whereGenerator.js");

describe('mysql-query-factory-test', function () {
    migrationSetup.migrationTablesEnabled = false;
    //---------------------------------------------------
    it('get-query-able', function () {
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();

        let factory = new queryFactory(mocks.dbSelectJoin(), "product");
        factory.getQuery().filter((product) =>
            product.name.equals("TV") &&
            product.owner.name.like("Philip") || (
                product.owner.name.notLike("Bella") &&
                product.name.notEquals("Radio") &&
                product.owner.profiles.name.equals(99)
            ), {}).
            include((product) => product.owner).
            include((product) => product.owner.profiles).
            select((product) => ({
                ownerCount: product.owner.count
            }));
        let calculationValues = factory.getCalculationValues();
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
        let selectSQL = selectGenerator.getSQL(calculationValues.selects);
        let joinSQL = joinGenerator.getSQL(calculationValues.joinTree);
        let whereSQL = whereGenerator.getSQL(calculationValues.queryNodes);
        let fullSQL = selectSQL + joinSQL + whereSQL;
    });

});