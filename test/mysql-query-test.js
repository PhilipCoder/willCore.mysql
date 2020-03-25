const willCoreProxy = require("willcore.core");
const assert = require('chai').assert;

describe('mysql-query-test', function () {
    it('test-arrow-function-parameter-renaming', async function () {
        let proxyInstance = willCoreProxy.new();
        proxyInstance.testDB.mysql = ["127.0.0.1","root","mySQLPassword01"];
        proxyInstance.testDB.users.table;
        proxyInstance.testDB.users.id.column.int;
        proxyInstance.testDB.users.id.primary;
        proxyInstance.testDB.users.name.column.string;
        proxyInstance.testDB.users.name.index;
        proxyInstance.testDB.users.email.column.string;
        proxyInstance.testDB.product.table;
        proxyInstance.testDB.product.id.column.int;
        proxyInstance.testDB.product.id.primary;
        proxyInstance.testDB.product.name.column.string;
        proxyInstance.testDB.product.description.column.string;
        proxyInstance.testDB.product.buyer = proxyInstance.testDB.users.id;
        await proxyInstance.testDB.init(true);
        let db = proxyInstance.testDB.queryDB;
        let newUserA = {name:"john",email:"aaa@gmail.com"};
        let newUserB = {name:"doe",email:"bbbb@gmail.com"};
        db.users["+"] = [newUserA,newUserB];
        await db.save();
        let john = await db.users.filter((user) => user.name === "john")()
        assert(john.length === 1);
        assert(john[0].name === "john");
    });

    it('test-data-updating', async function () {
        let proxyInstance = willCoreProxy.new();
        proxyInstance.testDB.mysql = ["127.0.0.1","root","mySQLPassword01"];
        proxyInstance.testDB.users.table;
        proxyInstance.testDB.users.id.column.int;
        proxyInstance.testDB.users.id.primary;
        proxyInstance.testDB.users.name.column.string;
        proxyInstance.testDB.users.name.index;
        proxyInstance.testDB.users.email.column.string;
        proxyInstance.testDB.product.table;
        proxyInstance.testDB.product.id.column.int;
        proxyInstance.testDB.product.id.primary;
        proxyInstance.testDB.product.name.column.string;
        proxyInstance.testDB.product.description.column.string;
        proxyInstance.testDB.product.buyer = proxyInstance.testDB.users.id;
        proxyInstance.testDB._assignable.dbInfo.instantiated = true;
        let db = proxyInstance.testDB.queryDB;
        let newUserA = {name:"john",email:"aaa@gmail.com"};
        db.users[12] = newUserA;
        let contextStateManager = db._assignable.contextStateManager;
        assert(contextStateManager.operations.items.length === 1,"Updated values not in queue");
        assert(contextStateManager.operations.items[0].constructor.name === "updateOperation","Queued operations not of the right type.");
        assert(contextStateManager.operations.items[0].table === "users","Queued update operation is not on the right table.");
        assert(contextStateManager.operations.items[0].whereField === "id","Queued update operation does not have the right where field.");
        assert(contextStateManager.operations.items[0].whereValue === "12","Queued update operation does not have the right where value.");

        assert(Object.keys(contextStateManager.operations.items[0].updateValues).length === 2,"Queued update data is incorrect.");
        assert(contextStateManager.operations.items[0].updateValues.email === "aaa@gmail.com","Queued update data is incorrect.");
        assert(contextStateManager.operations.items[0].updateValues.name === "john","Queued update data is incorrect.");


    });

});