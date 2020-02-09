const assert = require('chai').assert;
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const preprocessor = require("../sqlGeneration/queries/tokenPreProcessor.js");

describe('mysql-preprocessor-test', function () {
    migrationSetup.migrationTablesEnabled = false;
    it('first', async function () {
        let expectedResults = await getFilterParts((user)=>user.id.equals(userId) && "5".notEquals(user.name),{userId:1});
        let parts = await getFilterParts((user)=>user.id === userId && "5" !== user.name,{userId:1});
        let processorInstance = new preprocessor();
        let results = processorInstance.process(parts);
        assert(expectedResults.length === results.length, "The processed results does not have the correct length.");
        for (let i = 0; i < results.length; i++){
            assert(expectedResults[i].type === results[i].type, `The type of the processed node at index ${i} is incorrect.`);
            assert(expectedResults[i].value === results[i].value, `The value of the processed node at index ${i} is incorrect.`);
        }
    });

    function getFilterParts(func){
        return new Promise(async(resolve,reject)=>{
            migrationSetup.migrationTablesEnabled = true;
            rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
            rewiremock.enable();
            let myDB = mocks.manyFKCreateDB();
            const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(myDB);
            dbGenerator.dropDB = true;
            dbGenerator.sql;
            let queryAble = await myDB.user.filter(func);
            let values = queryAble.getValues().filter.parts;
            rewiremock.disable();
            migrationSetup.migrationTablesEnabled = false;
            resolve(values);
        });
    }
});