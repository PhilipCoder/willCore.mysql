const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler");
const contextStateManager = require("../../../sqlGeneration/state/contextStateManager.js");
const dbInfoQuery = require("../../../sqlExecutor/dbInfoQuery.js");
//const tableProxy = require("../table/dbTable.js");
class mysqlProxyHandler extends assignableProxyHandler {
  constructor() {
    super();
    this.getTraps.unshift(this.getTableCopy);
    this.getTraps.unshift(this.getUpdateFunction);
    this.getTraps.unshift(this.getSaveFunction);
    this.getTraps.unshift(this.getQueryDB);
    this.getTraps.unshift(this.getDBStructure);
  }

  getDBStructure(target, property, proxy) {
    if (property === "getStructure") {
      let structureFunction = async function () {
        return await dbInfoQuery.getDBInfo(proxy._mysqlAssignable);
      };
      structureFunction.bind(proxy);
      return { value: structureFunction, status: true };
    }
    return { value: false, status: false };
  }

  getTableCopy(target, property, proxy) {
    if (target[property]) {
      let result = target[property].getCopy();
      let dbTableAssignable = new target[property]._dbTableAssignable.constructor();
      dbTableAssignable.tableInfo = target[property]._dbTableAssignable.tableInfo;
      dbTableAssignable.parentProxy = proxy;
      result._dbTableAssignable = dbTableAssignable;
      return { value: result, status: true };
    }
    return { value: false, status: false };
  }

  getUpdateFunction(target, property, proxy) {
    if (property === "init") {
      let initFunction = function (dropDB) {
        proxy._mysqlAssignable.dbInfo.instantiated = true;
        proxy._mysqlAssignable.dbGenerator.dropDB = !!dropDB;
        return proxy._mysqlAssignable.dbGenerator.generateDB();
      };
      initFunction.bind(proxy);
      return { value: initFunction, status: true };
    }
    return { value: false, status: false };
  }

  getSaveFunction(target, property, proxy) {
    if (property === "save") {
      let saveFunction = function () {
        return proxy._mysqlAssignable.contextStateManager.run();
      };
      saveFunction.bind(proxy);
      return { value: saveFunction, status: true };
    }
    return { value: false, status: false };
  }

  getQueryDB(target, property, proxy) {
    if (property === "queryDB") {
        if (!proxy._mysqlAssignable.dbInfo.instantiated) {
          throw "Unable to retrieve the queryDB. Database should first be instantiated via the init() command().";
        }
        let handler = new mysqlProxyHandler();
        for (let key in this.hiddenVariables) {
          handler.hiddenVariables[key] = this.hiddenVariables[key];
        }
        let mysqlAssignable = {};
        mysqlAssignable.queryExecutor = this.hiddenVariables._mysqlAssignable.queryExecutor;
        mysqlAssignable.dbInfo = this.hiddenVariables._mysqlAssignable.dbInfo;
        mysqlAssignable.dbGenerator = this.hiddenVariables._mysqlAssignable.dbGenerator;
        mysqlAssignable.contextStateManager = new contextStateManager(this.hiddenVariables._mysqlAssignable.queryExecutor,this.hiddenVariables._mysqlAssignable.type);
        handler.hiddenVariables._mysqlAssignable = mysqlAssignable;
        let result = new Proxy(target, handler);
        return { value: result, status: true };
    }
    return { value: false, status: false };
  }
}

module.exports = mysqlProxyHandler;