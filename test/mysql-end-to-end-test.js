const assert = require('chai').assert;
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");

describe('mysql-end-to-end-test', function () {
    migrationSetup.migrationTablesEnabled = false;
    it('db-create-end-to-end', async function () {
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        let myDB = mocks.manyFKCreateDB();
        await myDB.init(true);
        let queryDB = myDB.queryDB;
        let userA = {name:"Philip"};
        queryDB.user.add(userA);
        let userB = {name:"Jurgens"};
        queryDB.user.add(userB);
        let userC = {name:"The Great White"};
        queryDB.user.add(userC);
        queryDB.profile.add({name:"First Profile",person:1});
        queryDB.profile.add({name:"First Profile",person:1});
        queryDB.profile.add({name:"vlooi",person:2});
        await queryDB.save();
        let query = await queryDB.user.filter((user)=>user.id.equals(1)).include((user)=>user.profiles)();
        assert(query.length === 1,"The query result should only contain one item.");
        assert(query[0].id === 1,"Invalid query result.");
        assert(query[0].name === "Philip","Invalid query result.");
        assert(query[0].profiles.length === 2,"Invalid query result.");
        assert(query[0].profiles[0].id === 1,"Invalid query result.");
        assert(query[0].profiles[0].name === "First Profile","Invalid query result.");
        assert(query[0].profiles[1].id === 2,"Invalid query result.");
        assert(query[0].profiles[1].name === "First Profile","Invalid query result.");
        query[0].name = "John";
        query[0].profiles[0].name = "John Pro Profile";
        await queryDB.save();
        let queryUpdated = await queryDB.user.filter((user)=>user.id.equals(1)).include((user)=>user.profiles)();
        assert(queryUpdated.length === 1,"The query result should only contain one item.");
        assert(queryUpdated[0].id === 1,"Invalid query result.");
        assert(queryUpdated[0].name === "John","Invalid query result.");
        assert(queryUpdated[0].profiles.length === 2,"Invalid query result.");
        assert(queryUpdated[0].profiles[0].id === 1,"Invalid query result.");
        assert(queryUpdated[0].profiles[0].name === "John Pro Profile","Invalid query result.");
        queryDB.user.delete(1);
        await queryDB.save();
        let queryAfterDelete = await queryDB.user.filter((user)=>user.id.equals(1))();
        assert(queryAfterDelete.length === 0, "Row not deleted.");
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
    });
    it('db-create-end-to-end-assignment', async function () {
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        let myDB = mocks.manyFKCreateDB();
        //Creates database
        await myDB.init(true);
        let queryDB = myDB.queryDB;
        //add some users
        let users = [{name:"Philip"},{name:"Jurgens"},{name:"The Great White"}];
        queryDB.user["+"] = users;
        await queryDB.save();
        //give the users some profiles
        let profiles = [
            {name:"First Profile",person:users[0].id},
            {name:"Second Profile",person:users[0].id},
            {name:"vlooi",person:users[1].id}
        ];
        queryDB.profile["+"] = profiles; 
        await queryDB.save();
        //Get the first inserted user.
        let query = await queryDB.user.filter((user)=>user.id === userId || ( user.id === 3 ) ||  user.profiles.name === "vlooi",{userId:1}).include((user)=>user.profiles)();
        assert(query.length === 3,"The query result should only contain one item.");
        assert(query[0].id === 1,"Invalid query result.");
        assert(query[0].name === "Philip","Invalid query result.");
        assert(query[0].profiles.length === 2,"Invalid query result.");
        assert(query[0].profiles[0].id === 1,"Invalid query result.");
        assert(query[0].profiles[0].name === "First Profile","Invalid query result.");
        assert(query[0].profiles[1].id === 2,"Invalid query result.");
        assert(query[0].profiles[1].name === "Second Profile","Invalid query result.");
        assert(query[2].id === 3,"Invalid query result.");
        assert(query[2].name === "The Great White","Invalid query result.");
        assert(query[2].profiles.length === 0,"Invalid query result.");
        query[0].name = "John";
        query[0].profiles[0].name = "John Pro Profile";
        await queryDB.save();
        let queryUpdated = await queryDB.user.filter((user)=>user.id === 1).include((user)=>user.profiles)();
        assert(queryUpdated.length === 1,"The query result should only contain one item.");
        assert(queryUpdated[0].id === 1,"Invalid query result.");
        assert(queryUpdated[0].name === "John","Invalid query result.");
        assert(queryUpdated[0].profiles.length === 2,"Invalid query result.");
        assert(queryUpdated[0].profiles[0].id === 1,"Invalid query result.");
        assert(queryUpdated[0].profiles[0].name === "John Pro Profile","Invalid query result.");
        queryDB.user[1] = undefined;
        await queryDB.save();
        let queryAfterDelete = await queryDB.user.filter((user)=>user.id === 1)();
        assert(queryAfterDelete.length === 0, "Row not deleted.");
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
    });
});