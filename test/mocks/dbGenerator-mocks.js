const willCoreProxy = require("willcore.core");

const migrationSourceStub = {
    getSource: (name) => {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
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

        return proxy.myDB._mysqlAssignable.dbInfo;
    }
};

const migrationSourceNoFKStub = {
    getSource: (name) => {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql  = ["127.0.0.1", "root", "mySQLPassword01"];
        proxy.myDB.user.table;
        proxy.myDB.user.id.column.int;
        proxy.myDB.user.id.primary;
        proxy.myDB.user.name.column.string;

        proxy.myDB.product.table;
        proxy.myDB.product.id.column.int;
        proxy.myDB.product.id.primary;
        proxy.myDB.product.name.column.string;

        return proxy.myDB._mysqlAssignable.dbInfo;
    }
};

const migrationSourceNoFKColStub = {
    getSource: (name) => {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
        proxy.myDB.user.table;
        proxy.myDB.user.id.column.int;
        proxy.myDB.user.id.primary;
        proxy.myDB.user.name.column.string;

        proxy.myDB.product.table;
        proxy.myDB.product.id.column.int;
        proxy.myDB.product.id.primary;
        proxy.myDB.product.name.column.string;
        proxy.myDB.product.owner.column.int;

        return proxy.myDB._mysqlAssignable.dbInfo;
    }
};

const migrationSourceMultipuleFKStub = {
    getSource: (name) => {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql  = ["127.0.0.1", "root", "mySQLPassword01"];
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

        proxy.myDB.profile.table;
        proxy.myDB.profile.id.column.int;
        proxy.myDB.profile.id.primary;
        proxy.myDB.profile.name.column.string;
        proxy.myDB.profile.person.column.int;
        proxy.myDB.profile.person = proxy.myDB.user.id;

        return proxy.myDB._mysqlAssignable.dbInfo;
    }
};

const migrationSourceManyFKStub = {
    getSource: (name) => {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql  = ["127.0.0.1", "root", "mySQLPassword01"];
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

        proxy.myDB.profile.table;
        proxy.myDB.profile.id.column.int;
        proxy.myDB.profile.id.primary;
        proxy.myDB.profile.name.column.string;
        proxy.myDB.profile.person.column.int;
        proxy.myDB.profile.person = proxy.myDB.user.id;

        proxy.myDB.productDetails.table;
        proxy.myDB.productDetails.id.column.int;
        proxy.myDB.productDetails.id.primary;
        proxy.myDB.productDetails.name.column.string;
        proxy.myDB.productDetails.product.column.int;
        proxy.myDB.productDetails.product = proxy.myDB.product.id;

        return proxy.myDB._mysqlAssignable.dbInfo;
    }
};

const emptyMigrationSource = {
    getSource: (name) => {
    }
};

const defaultTwoTableDBFactory = () => {
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
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
    return proxy.myDB;
};

const addtableDBFactory = () => {
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql  = ["127.0.0.1", "root", "mySQLPassword01"];
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

    proxy.myDB.category.table;
    proxy.myDB.category.id.column.int;
    proxy.myDB.category.id.primary;
    proxy.myDB.category.name.column.string;
    proxy.myDB.category.description.column.string;

    return proxy.myDB;
};

const addColumnDBFactory = () => {
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql  = ["127.0.0.1", "root", "mySQLPassword01"];
    proxy.myDB.user.table;
    proxy.myDB.user.id.column.int;
    proxy.myDB.user.id.primary;
    proxy.myDB.user.name.column.string;
    proxy.myDB.user.dob.column.date;

    proxy.myDB.product.table;
    proxy.myDB.product.id.column.int;
    proxy.myDB.product.id.primary;
    proxy.myDB.product.name.column.string;
    proxy.myDB.product.description.column.string;
    proxy.myDB.product.owner.column.int;
    proxy.myDB.product.owner = proxy.myDB.user.id;
    return proxy.myDB;
};

const addColumnFKDBFactory = () => {
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql  = ["127.0.0.1", "root", "mySQLPassword01"];
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
    return proxy.myDB;
};


const addFKDBFactory = () => {
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
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

    return proxy.myDB;
};

const dropColumns = () => {
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql  = ["127.0.0.1", "root", "mySQLPassword01"];
    proxy.myDB.user.table;
    proxy.myDB.user.id.column.int;
    proxy.myDB.user.id.primary;

    proxy.myDB.product.table;
    proxy.myDB.product.id.column.int;
    proxy.myDB.product.id.primary;
    proxy.myDB.product.name.column.string;

    return proxy.myDB;
};

const dropColumnsFK = () =>{
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
    proxy.myDB.user.table;
    proxy.myDB.user.id.column.int;
    proxy.myDB.user.id.primary;
    proxy.myDB.user.name.column.string;

    proxy.myDB.product.table;
    proxy.myDB.product.id.column.int;
    proxy.myDB.product.id.primary;
    proxy.myDB.product.name.column.string;

    proxy.myDB.profile.table;
    proxy.myDB.profile.id.column.int;
    proxy.myDB.profile.id.primary;
    proxy.myDB.profile.name.column.string;

    return proxy.myDB;
};

const dropFK = () => {
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql  = ["127.0.0.1", "root", "mySQLPassword01"];
    proxy.myDB.user.table;
    proxy.myDB.user.id.column.int;
    proxy.myDB.user.id.primary;
    proxy.myDB.user.name.column.string;

    proxy.myDB.product.table;
    proxy.myDB.product.id.column.int;
    proxy.myDB.product.id.primary;
    proxy.myDB.product.name.column.string;
    proxy.myDB.product.price.column.decimal;

    proxy.myDB.profile.table;
    proxy.myDB.profile.id.column.int;
    proxy.myDB.profile.id.primary;
    proxy.myDB.profile.name.column.string;

    return proxy.myDB;
};

const manyFKCreateDB = () =>{
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
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

    proxy.myDB.profile.table;
    proxy.myDB.profile.id.column.int;
    proxy.myDB.profile.id.primary;
    proxy.myDB.profile.name.column.string;
    proxy.myDB.profile.person.column.int;
    proxy.myDB.profile.person = proxy.myDB.user.id;
    proxy.myDB.user.profiles = proxy.myDB.profile.person;

    proxy.myDB.productDetails.table;
    proxy.myDB.productDetails.id.column.int;
    proxy.myDB.productDetails.id.primary;
    proxy.myDB.productDetails.name.column.string;
    proxy.myDB.productDetails.product.column.int;
    proxy.myDB.productDetails.product = proxy.myDB.product.id;
    proxy.myDB._mysqlAssignable.dbInfo.instantiated = true;
    return proxy.myDB;
};


const dbSelectJoin= () =>{
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql = ["127.0.0.1", "root", "mySQLPassword01"];
    proxy.myDB.user.table;
    proxy.myDB.user.id.column.int;
    proxy.myDB.user.id.primary;
    proxy.myDB.user.name.column.string;

    proxy.myDB.profile.table;
    proxy.myDB.profile.id.column.int;
    proxy.myDB.profile.id.primary;
    proxy.myDB.profile.name.column.string;
    proxy.myDB.profile.person.column.int;
    proxy.myDB.profile.person = proxy.myDB.user.id;
    proxy.myDB.user.profiles = proxy.myDB.profile.person;

    proxy.myDB.productDetails.table;
    proxy.myDB.productDetails.id.column.int;
    proxy.myDB.productDetails.id.primary;
    proxy.myDB.productDetails.name.column.string;
 

    proxy.myDB.product.table;
    proxy.myDB.product.id.column.int;
    proxy.myDB.product.id.primary;
    proxy.myDB.product.name.column.string;
    proxy.myDB.product.owner = proxy.myDB.user.id;
    proxy.myDB.product.details = proxy.myDB.productDetails.id;
    proxy.myDB.productDetails.products = proxy.myDB.product.details;
    return proxy.myDB;
};


exports.migrationSourceStub = migrationSourceStub;
exports.emptyMigrationSource = emptyMigrationSource;
exports.defaultTwoTableDBFactory = defaultTwoTableDBFactory;
exports.addtableDBFactory = addtableDBFactory;
exports.addColumnDBFactory = addColumnDBFactory;
exports.addColumnFKDBFactory = addColumnFKDBFactory;
exports.addFKDBFactory = addFKDBFactory;
exports.migrationSourceNoFKStub = migrationSourceNoFKStub;
exports.migrationSourceNoFKColStub = migrationSourceNoFKColStub;
exports.dropColumns = dropColumns;
exports.migrationSourceMultipuleFKStub = migrationSourceMultipuleFKStub;
exports.dropColumnsFK = dropColumnsFK;
exports.migrationSourceManyFKStub = migrationSourceManyFKStub;
exports.dropFK = dropFK;
exports.manyFKCreateDB = manyFKCreateDB;
exports.dbSelectJoin = dbSelectJoin;