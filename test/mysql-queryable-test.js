const assert = require('chai').assert;
const query = require("../sqlGeneration/queries/queryGenerator.js");
const queryFactory = require("../sqlGeneration/queries/queryable.js");
const chainableProxyHandler = require("willcore.core/proxies/chainable/chainableProxyHandler.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");

/**
 * Test for generic query operations
 */
describe('mysql-queryable', function () {
  require('module-alias/register');
  it('query-select-expression', function () {
    let selectQuery = new query();
    selectQuery.select(() => ({ name, age, ownerName: owner.name }));
    assert(selectQuery.run.selectExpression.length === 11, "The assigned select expression an incorrect number of tokens.");
  });

  it('query-select-expression-validate', function () {
    let selectQuery = new query();
    assert.throws(() => selectQuery.select(() => "sss"), "Invalid argument passed to the query select statement. The select statement should be an arrow function returning an object with the fields selected.", "The validation did not block the assignment.");
  });

  it('query-filter-expression', function () {
    let selectQuery = new query();
    selectQuery.filter(() => name === "one" && age > 10 && owner.name === "Philip", {});
    assert(selectQuery.run.filterExpression.length === 13, "The assigned select expression has an incorrect type.");
  });

  it('queryFactory-test', function () {
    let queryAble = queryFactory.get({}, "person");
    let name = "Phil";
    queryAble.
      filter(
        (person) => person.name === name && person.details.age > 21,
        { name: name }
      ).
      select((person) => ({
        name: person.name,
        surname: person.surname,
        age: person.details.age
      })).
      take(1).
      skip(2).
      sort((person) => person.name,true);

    let queryValues = queryAble.getValues();
    assert(queryValues !== null, "Query factory not getting right queryable.");
  });

  it('chainableProxy-test', function () {
    let user = chainableProxyHandler.new("user");
    let chainResult = user.details.address.city;
    let value = chainResult._name;
    assert(value.length === 4);
    assert(value[0] === "user", "Chainable proxy not assigning correct values.");
    assert(value[1] === "details", "Chainable proxy not assigning correct values.");
    assert(value[2] === "address", "Chainable proxy not assigning correct values.");
    assert(value[3] === "city", "Chainable proxy not assigning correct values.");
  });


  it('query-getObjectProperty-test', function () {
    let selectQuery = new query();

    let obj = {
      name: "Phil",
      address: {
        city: "centurion",
        area: {
          postal: 123
        }
      }
    };

    let name = selectQuery.getObjectProperty(obj, [{ value: "name" }]);
    let city = selectQuery.getObjectProperty(obj, [{ value: "address" }, { value: "city" }]);
    let postal = selectQuery.getObjectProperty(obj, [{ value: "address" }, { value: "area" }, { value: "postal" }]);

    assert(name === "Phil", "Incorrect property retrieved from object.");
    assert(city === "centurion", "Incorrect property retrieved from object.");
    assert(postal === 123, "Incorrect property retrieved from object.");
  });

  it('query-filter-scoped-test', function () {
    let selectQuery = new query();
    let parts = selectQuery.filter((person) => person.name === name && person.age > 10 && person.owner.name === owner.name || one === "ss", {
      name: "DrPhil",
      owner: {
        name: "Life"
      }
    });
    assert(parts.nodes.length === 23, "The generated filter query has incorrect parts");
    assert(parts.parameters.length === 2, "The generated filter query has parameters");
  });

  it('query-select-join-obj', function () {
    migrationSetup.migrationTablesEnabled = true;
    rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
    rewiremock.enable();
    let myDB = mocks.dbSelectJoin();
    const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(myDB);
    dbGenerator.dropDB = true;
    dbGenerator.sql;
    let dbInfo = dbGenerator._comparisonTarget;

    let queryAble = queryFactory.get(dbInfo, "product");
    queryAble.
      select((product) => ({
        name: product.name,
        ownerName: product.owner.name,
        detailName: product.details.name
      }));
    rewiremock.disable();
    migrationSetup.migrationTablesEnabled = false;

    let queryValues = queryAble.getValues();
    let selectQuery = new query(dbInfo, "product");
    let result = selectQuery.getJoinObj(queryValues.select.selectParts).tableAliases;

    assert(result["product"].length === 1, "Generated join object is incorrect");
    assert(result["product.details"].length === 2, "Generated join object is incorrect");
    assert(result["product.owner"].length === 2, "Generated join object is incorrect");

    assert(result["product"][0] === "product", "Generated join object is incorrect");
    assert(result["product.details"][0] === "product", "Generated join object is incorrect");
    assert(result["product.details"][1] === "productDetails", "Generated join object is incorrect");

    assert(result["product.owner"][0] === "product", "Generated join object is incorrect");
    assert(result["product.owner"][1] === "user", "Generated join object is incorrect");
  });

  it('query-where-join-obj', function () {
    migrationSetup.migrationTablesEnabled = true;
    rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
    rewiremock.enable();
    let myDB = mocks.dbSelectJoin();
    const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(myDB);
    dbGenerator.dropDB = true;
    dbGenerator.sql;
    let dbInfo = dbGenerator._comparisonTarget;

    let queryAble = queryFactory.get(dbInfo, "product");
    queryAble.filter((product) => product.name === "TV" && product.owner.name.like("Philip"), {});

    rewiremock.disable();
    migrationSetup.migrationTablesEnabled = false;

    let queryValues = queryAble.getValues();
    let selectQuery = new query(dbInfo, "product");
    let result = selectQuery.getJoinObj({}, queryValues.filter.parts).tableAliases;
    assert(result["product"].length === 1, "Generated join object is incorrect");
    assert(result["product"][0] === "product", "Generated join object is incorrect");

    assert(result["product.owner"].length === 2, "Generated join object is incorrect");
    assert(result["product.owner"][0] === "product", "Generated join object is incorrect");
    assert(result["product.owner"][1] === "user", "Generated join object is incorrect");
  });

  it('query-include-test', function () {
    migrationSetup.migrationTablesEnabled = true;
    rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
    rewiremock.enable();
    let myDB = mocks.dbSelectJoin();
    const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(myDB);
    dbGenerator.dropDB = true;
    dbGenerator.sql;
    let dbInfo = dbGenerator._comparisonTarget;

    let queryAble = queryFactory.get(dbInfo, "product");
    queryAble.include((product) => product.owner);
    assert(queryAble.getValues().includes["product.owner"] === true, "Queryable's include values not correct.");
    rewiremock.disable();
    migrationSetup.migrationTablesEnabled = false;
  });

  it('query-include-selects-test', function () {
    migrationSetup.migrationTablesEnabled = true;
    rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
    rewiremock.enable();
    let myDB = mocks.dbSelectJoin();
    const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(myDB);
    dbGenerator.dropDB = true;
    dbGenerator.sql;
    let dbInfo = dbGenerator._comparisonTarget;

    let queryAble = queryFactory.get(dbInfo, "product");
    queryAble.include((product) => product.owner);
    assert(queryAble.getValues().includes["product.owner"] === true, "Queryable's include values not correct.");
    rewiremock.disable();
    migrationSetup.migrationTablesEnabled = false;
  });

  it('query-where-join-tree', function () {
    migrationSetup.migrationTablesEnabled = true;
    rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
    rewiremock.enable();
    let myDB = mocks.dbSelectJoin();
    const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(myDB);
    dbGenerator.dropDB = true;
    dbGenerator.sql;
    let dbInfo = dbGenerator._comparisonTarget;

    let queryAble = queryFactory.get(dbInfo, "product");
    queryAble.filter((product) =>
      product.name.equals("TV") &&
      product.owner.name.like("Philip") || (
        product.owner.name.notLike("Bella") &&
        product.name.notEquals("Radio")
      )
      , {});
    queryAble.
      select((product) => ({
        name: product.name,
        ownerName: product.owner.name,
        detailName: product.details.name,
        ownerCount: product.owner.count
      }));
    rewiremock.disable();
    migrationSetup.migrationTablesEnabled = false;

    let queryValues = queryAble.getValues();
    let selectQuery = new query(dbInfo, "product");
    let joinObj = selectQuery.getJoinObj(queryValues.select.selectParts, queryValues.filter.parts);
    let result = selectQuery.getJoinTree(joinObj);
    assert(result.table === "product", "Generated join tree has an incorrect table.");
    assert(result.joins.owner.table === "user", "Generated join tree has an incorrect table.");
    assert(result.joins.owner.left === "id", "Generated join tree has an incorrect column.");
    assert(result.joins.owner.right === "owner", "Generated join tree has an incorrect column.");

    assert(result.joins.details.table === "productDetails", "Generated join tree has an incorrect table.");
    assert(result.joins.details.left === "id", "Generated join tree has an incorrect column.");
    assert(result.joins.details.right === "details", "Generated join tree has an incorrect column.");

  });
})