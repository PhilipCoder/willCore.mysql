const assert = require('chai').assert;
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const willCoreProxy = require("willcore.core");

describe('mysql-migration-end-to-end', function () {
    before(function () {
        this.timeout(10000);
        return new Promise(async (resolve, reject) => {
            migrationSetup.migrationTablesEnabled = true;
            //defines db
            let proxy = willCoreProxy.new();
            proxy.cars.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
            //defines person table
            proxy.cars.person.table;
            proxy.cars.person.id.column.int;
            proxy.cars.person.id.primary;
            proxy.cars.person.firstName.column.string;
            proxy.cars.person.lastName.column.string;
            proxy.cars.person.email.column.string;
            proxy.cars.person.gender.column.string;
            proxy.cars.person.ipAddress.column.string;
            proxy.cars.person.dateCreated.column.date;
            //defines car make table
            proxy.cars.carMake.table;
            proxy.cars.carMake.id.column.int;
            proxy.cars.carMake.id.primary;
            proxy.cars.carMake.name.column.string;
            //creates db
            await proxy.cars.init(true);
            resolve();
        });
    });
    it('add-table', function () {
        this.timeout(10000);
        return new Promise(async (resolve, reject) => {
            let proxy = willCoreProxy.new();
            proxy.cars.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
            //defines person table
            proxy.cars.person.table;
            proxy.cars.person.id.column.int;
            proxy.cars.person.id.primary;
            proxy.cars.person.firstName.column.string;
            proxy.cars.person.lastName.column.string;
            proxy.cars.person.email.column.string;
            proxy.cars.person.gender.column.string;
            proxy.cars.person.ipAddress.column.string;
            proxy.cars.person.dateCreated.column.date;
            //defines car make table
            proxy.cars.carMake.table;
            proxy.cars.carMake.id.column.int;
            proxy.cars.carMake.id.primary;
            proxy.cars.carMake.name.column.string;
            //defines cars table
            proxy.cars.car.table;
            proxy.cars.car.id.column.int;
            proxy.cars.car.id.primary;
            proxy.cars.car.model.column.string;
            proxy.cars.car.year.column.int;
            proxy.cars.car.color.column.string;
            proxy.cars.car.price.column.decimal;
            //make relation
            proxy.cars.car.make = proxy.cars.carMake.id;
            proxy.cars.carMake.cars = proxy.cars.car.make;
            //creates db
            await proxy.cars.init();
            //getDBStructure
            let dbStructure = await proxy.cars.getStructure();
            assert(!!dbStructure.tables["car"], "Migration failed to add a table to the database.");

            assert(!!dbStructure.tables["car"].columns["id"], "Table added via migration is missing a column.");
            assert(dbStructure.tables["car"].columns["id"].dataType === "int", "Table added via migration is the wrong type.");

            assert(!!dbStructure.tables["car"].columns["model"], "Table added via migration is missing a column.");
            assert(dbStructure.tables["car"].columns["model"].dataType === "varchar", "Table added via migration is the wrong type.");

            assert(!!dbStructure.tables["car"].columns["year"], "Table added via migration is missing a column.");
            assert(dbStructure.tables["car"].columns["year"].dataType === "int", "Table added via migration is the wrong type.");

            assert(!!dbStructure.tables["car"].columns["color"], "Table added via migration is missing a column.");
            assert(dbStructure.tables["car"].columns["color"].dataType === "varchar", "Table added via migration is the wrong type.");

            assert(!!dbStructure.tables["car"].columns["price"], "Table added via migration is missing a column.");
            assert(dbStructure.tables["car"].columns["price"].dataType === "decimal", "Table added via migration is the wrong type.");

            resolve();
        });
    });
    it('add-column', function () {
        this.timeout(10000);
        return new Promise(async (resolve, reject) => {
            let proxy = willCoreProxy.new();
            proxy.cars.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
            //defines person table
            proxy.cars.person.table;
            proxy.cars.person.id.column.int;
            proxy.cars.person.id.primary;
            proxy.cars.person.firstName.column.string;
            proxy.cars.person.lastName.column.string;
            proxy.cars.person.email.column.string;
            proxy.cars.person.gender.column.string;
            proxy.cars.person.ipAddress.column.string;
            proxy.cars.person.dateCreated.column.date;
            //defines car make table
            proxy.cars.carMake.table;
            proxy.cars.carMake.id.column.int;
            proxy.cars.carMake.id.primary;
            proxy.cars.carMake.name.column.string;
            //defines cars table
            proxy.cars.car.table;
            proxy.cars.car.id.column.int;
            proxy.cars.car.id.primary;
            proxy.cars.car.model.column.string;
            proxy.cars.car.year.column.int;
            proxy.cars.car.color.column.string;
            proxy.cars.car.price.column.decimal;
            proxy.cars.car.additionalDetails.column.text;
            //make relation
            proxy.cars.car.make = proxy.cars.carMake.id;
            proxy.cars.carMake.cars = proxy.cars.car.make;
            //creates db
            await proxy.cars.init();
            //getDBStructure
            let dbStructure = await proxy.cars.getStructure();

            let additionalDetailsColumn = dbStructure.tables["car"].columns["additionalDetails"];
            assert(!!additionalDetailsColumn, "Migration failed to add a column to the database.");
            assert(additionalDetailsColumn.dataType === "text", "Column added via migration has an incorrect type.");
            resolve();
        });
    });
    it('add-column-foreign-key', function () {
        this.timeout(10000);
        return new Promise(async (resolve, reject) => {
            let proxy = willCoreProxy.new();
            proxy.cars.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
            //defines person table
            proxy.cars.person.table;
            proxy.cars.person.id.column.int;
            proxy.cars.person.id.primary;
            proxy.cars.person.firstName.column.string;
            proxy.cars.person.lastName.column.string;
            proxy.cars.person.email.column.string;
            proxy.cars.person.gender.column.string;
            proxy.cars.person.ipAddress.column.string;
            proxy.cars.person.dateCreated.column.date;
            //defines car make table
            proxy.cars.carMake.table;
            proxy.cars.carMake.id.column.int;
            proxy.cars.carMake.id.primary;
            proxy.cars.carMake.name.column.string;
            //defines cars table
            proxy.cars.car.table;
            proxy.cars.car.id.column.int;
            proxy.cars.car.id.primary;
            proxy.cars.car.model.column.string;
            proxy.cars.car.year.column.int;
            proxy.cars.car.color.column.string;
            proxy.cars.car.price.column.decimal;
            proxy.cars.car.additionalDetails.column.text;
            //make relation
            proxy.cars.car.make = proxy.cars.carMake.id;
            proxy.cars.carMake.cars = proxy.cars.car.make;
            //owner relation
            proxy.cars.car.owner = proxy.cars.person.id;
            proxy.cars.person.cars = proxy.cars.car.owner;
            //creates db
            await proxy.cars.init();
            //getDBStructure
            let dbStructure = await proxy.cars.getStructure();
            let additionalDetailsColumn = dbStructure.tables["car"].columns["owner"];
            assert(!!additionalDetailsColumn, "Migration failed to add a foreign key column to the database.");
            assert(additionalDetailsColumn.dataType === "int", "Column added via migration has an incorrect type.");
            assert(additionalDetailsColumn.columnKey === "MUL", "Foreign key added via migration does not have a foreign key constraint.");
            resolve();
        });
    });

    it('drop-column', async function () {
        this.timeout(10000);
        return new Promise(async (resolve, reject) => {
            let proxy = willCoreProxy.new();
            proxy.cars.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
            //defines person table
            proxy.cars.person.table;
            proxy.cars.person.id.column.int;
            proxy.cars.person.id.primary;
            proxy.cars.person.firstName.column.string;
            proxy.cars.person.lastName.column.string;
            proxy.cars.person.email.column.string;
            proxy.cars.person.gender.column.string;
            proxy.cars.person.ipAddress.column.string;
            proxy.cars.person.dateCreated.column.date;
            //defines car make table
            proxy.cars.carMake.table;
            proxy.cars.carMake.id.column.int;
            proxy.cars.carMake.id.primary;
            proxy.cars.carMake.name.column.string;
            //defines cars table
            proxy.cars.car.table;
            proxy.cars.car.id.column.int;
            proxy.cars.car.id.primary;
            proxy.cars.car.model.column.string;
            proxy.cars.car.year.column.int;
            proxy.cars.car.color.column.string;
            proxy.cars.car.price.column.decimal;
            //make relation
            proxy.cars.car.make = proxy.cars.carMake.id;
            proxy.cars.carMake.cars = proxy.cars.car.make;
            //owner relation
            proxy.cars.car.owner = proxy.cars.person.id;
            proxy.cars.person.cars = proxy.cars.car.owner;
            //creates db
            await proxy.cars.init();
            //getDBStructure
            let dbStructure = await proxy.cars.getStructure();
            let additionalDetailsColumn = dbStructure.tables["car"].columns["additionalDetails"];
            assert(!additionalDetailsColumn, "Migration failed to remove a column.");
            resolve();
        });
    });
    it('drop-column-foreign-key', async function () {
        this.timeout(10000);
        return new Promise(async (resolve, reject) => {
            let proxy = willCoreProxy.new();
            proxy.cars.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
            //defines person table
            proxy.cars.person.table;
            proxy.cars.person.id.column.int;
            proxy.cars.person.id.primary;
            proxy.cars.person.firstName.column.string;
            proxy.cars.person.lastName.column.string;
            proxy.cars.person.email.column.string;
            proxy.cars.person.gender.column.string;
            proxy.cars.person.ipAddress.column.string;
            proxy.cars.person.dateCreated.column.date;
            //defines car make table
            proxy.cars.carMake.table;
            proxy.cars.carMake.id.column.int;
            proxy.cars.carMake.id.primary;
            proxy.cars.carMake.name.column.string;
            //defines cars table
            proxy.cars.car.table;
            proxy.cars.car.id.column.int;
            proxy.cars.car.id.primary;
            proxy.cars.car.model.column.string;
            proxy.cars.car.year.column.int;
            proxy.cars.car.color.column.string;
            proxy.cars.car.price.column.decimal;
            //make relation
            proxy.cars.car.make = proxy.cars.carMake.id;
            proxy.cars.carMake.cars = proxy.cars.car.make;
            //creates db
            await proxy.cars.init();
            //getDBStructure
            let dbStructure = await proxy.cars.getStructure();
            let additionalDetailsColumn = dbStructure.tables["car"].columns["owner"];
            assert(!additionalDetailsColumn, "Migration failed to remove a foreign key column.");
            resolve();
        });
    });
    it('drop-table', async function () {
        this.timeout(10000);
        return new Promise(async (resolve, reject) => {
            let proxy = willCoreProxy.new();
            proxy.cars.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
            //defines person table
            proxy.cars.person.table;
            proxy.cars.person.id.column.int;
            proxy.cars.person.id.primary;
            proxy.cars.person.firstName.column.string;
            proxy.cars.person.lastName.column.string;
            proxy.cars.person.email.column.string;
            proxy.cars.person.gender.column.string;
            proxy.cars.person.ipAddress.column.string;
            proxy.cars.person.dateCreated.column.date;
            //defines car make table
            proxy.cars.carMake.table;
            proxy.cars.carMake.id.column.int;
            proxy.cars.carMake.id.primary;
            proxy.cars.carMake.name.column.string;
            //creates db
            await proxy.cars.init();
            //getDBStructure
            let dbStructure = await proxy.cars.getStructure();
            assert(!dbStructure.tables["car"], "Migration failed to remove a table.");
            resolve();
        });

    });
});