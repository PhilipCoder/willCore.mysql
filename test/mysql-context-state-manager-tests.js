const assert = require('chai').assert;
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const contextStateManager = require("../sqlGeneration/state/contextStateManager.js");
const proxyMapper = require("../proxies/entities/proxyMapper.js");

describe('mysql-context-state-manager-tests', function () {
    migrationSetup.migrationTablesEnabled = false;
    it('test-add-row', function () {
        let manager = new contextStateManager(null, "mySQL");
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        manager.addRow("person", { name: "John", surname: "Doe", age: 47 });
        assert(manager.operations.isEmpty() === false, "Queue should contain items.");
        let queryObj = manager.operations.dequeue().getSQL();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        assert(queryObj.sql === "INSERT INTO person SET ? ", "Wrong SQL generated.");
        assert(queryObj.parameter.name === "John", "Wrong query parameter returned.");
    });
    it('test-update-row', function () {
        let manager = new contextStateManager(null, "mySQL");
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        manager.updateField("person", {name:"Johnny"}, "id", 32);
        assert(manager.operations.isEmpty() === false, "Queue should contain items.");
        let queryObj = manager.operations.dequeue().getSQL();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        assert(queryObj.sql === "UPDATE person SET name = ? WHERE id = ?", "Wrong SQL generated.");
        assert(queryObj.parameter[0] === "Johnny", "Wrong query parameter returned.");
        assert(queryObj.parameter[1] === 32, "Wrong query parameter returned.");
    });
    it('test-delete-row', function () {
        let manager = new contextStateManager(null, "mySQL");
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        manager.deleteRow("person", "id", 32);
        assert(manager.operations.isEmpty() === false, "Queue should contain items.");
        let queryObj = manager.operations.dequeue().getSQL();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        assert(queryObj.sql === "DELETE FROM person WHERE id = ?", "Wrong SQL generated.");
        assert(queryObj.parameter[0] === 32, "Wrong query parameter returned.");
    });
});