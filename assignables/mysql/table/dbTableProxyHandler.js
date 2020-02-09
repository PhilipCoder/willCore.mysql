const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler");
const columnProxy = require("../column/dbColumnProxy.js");
const queryFactory = require("../../../sqlGeneration/queries/queryFactory.js");
const assignable = require("willcore.core/assignable/assignable");
const dbColumnProxy = require("../../../assignables/mysql/column/dbColumnProxy.js");

class dbTableProxyHandler extends assignableProxyHandler {
  constructor() {
    super();
    this.setTraps.unshift(this.assignReference);
    this.setTraps.unshift(this.assignReferenceNewColumn);
    this.setTraps.unshift(this.deleteRowAssignment);
    this.setTraps.unshift(this.updateRowAssignment);
    this.setTraps.unshift(this.addRowAssignment);
    this.getTraps.unshift(this.getAddFunction);
    this.getTraps.unshift(this.getQueryableFunction);
    this.getTraps.unshift(this.deleteRow);
  }

  assignReference(target, property, value, proxy) {
    if (value instanceof columnProxy && target[property] instanceof columnProxy) {
      let targetColumnName = value._dbColumnAssignable.columnInfo.name;
      let targetTableName = value._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      let tableName = proxy[property]._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      target[property]._dbColumnAssignable.columnInfo.reference = {
        table: targetTableName,
        column: targetColumnName,
        thisTable: tableName,
        primary: !value._dbColumnAssignable.columnInfo.reference
      };
      return { value: true };
    }
    return { value: false, status: false };
  }

  assignReferenceNewColumn(target, property, value, proxy) {
    if (value instanceof columnProxy && !target[property]) {
      proxy[property].column.int;
      target[property]._dbColumnAssignable.columnInfo.type = value._dbColumnAssignable.columnInfo.type;
      target[property]._dbColumnAssignable.columnInfo.size = value._dbColumnAssignable.columnInfo.size;

      let targetColumnName = value._dbColumnAssignable.columnInfo.name;
      let targetTableName = value._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      let tableName = proxy[property]._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      target[property]._dbColumnAssignable.columnInfo.reference = {
        table: targetTableName,
        column: targetColumnName,
        thisTable: tableName,
        primary: !value._dbColumnAssignable.columnInfo.reference
      };
      return { value: true };
    }
    return { value: false, status: false };
  }

  deleteRowAssignment(target, property, value, proxy) {
    if (!property.startsWith("_") && value === undefined) {
      let statemanager = proxy._dbTableAssignable.parentProxy._mysqlAssignable.contextStateManager;
      let primaryColumn = proxy._dbTableAssignable.tableInfo.columns.filter(x=>x.primary)[0].name;
      statemanager.deleteRow(proxy._dbTableAssignable.tableInfo.name, primaryColumn,property);
      return { value: true };
    }
    return { value: false, status: false };
  }

  addRowAssignment(target, property, value, proxy) {
    if (property === "+" && value !== undefined) {
      let statemanager = proxy._dbTableAssignable.parentProxy._mysqlAssignable.contextStateManager;
      if (Array.isArray(value)){
        value.forEach(item=>{
          statemanager.addRow(proxy._dbTableAssignable.tableInfo.name,item);});
      }else{
        statemanager.addRow(proxy._dbTableAssignable.tableInfo.name,value);
      }
      return { value: true };
    }
    return { value: false, status: false };
  }

  updateRowAssignment(target, property, value, proxy) {
    if (!property.startsWith("_") && value !== undefined && typeof value === "object" && (value instanceof assignable || value instanceof dbColumnProxy) === false) {
      let statemanager = proxy._dbTableAssignable.parentProxy._mysqlAssignable.contextStateManager;
      let primaryColumn = proxy._dbTableAssignable.tableInfo.columns.filter(x=>x.primary)[0].name;
      statemanager.updateField(proxy._dbTableAssignable.tableInfo.name, value, primaryColumn, property);
      return { value: true };
    }
    return { value: false, status: false };
  }

  getAddFunction(target, property, proxy) {
    if (property === "add") {
      let addFunction = function (data) {
        let statemanager = proxy._dbTableAssignable.parentProxy._mysqlAssignable.contextStateManager;
        let tableName = proxy._dbTableAssignable.tableInfo.name;
        statemanager.addRow(tableName, data);
      };
      addFunction.bind(proxy);
      return { value: addFunction, status: true };
    }
    return { value: false, status: false };
  }

  getQueryableFunction(target, property, proxy) {
    if (property === "filter" || property === "select" || property === "include" || property === "sort" || property === "take" || property === "skip") {
      let factory = new queryFactory(proxy._dbTableAssignable.parentProxy, proxy._dbTableAssignable.tableInfo.name);
      let query = factory.getQuery();
      return { value: query[property], status: true };
    }
    return { value: false, status: false };
  }

  deleteRow(target, property,proxy) {
    if (property === "delete") {
      let deleteFunction = function (primaryIdentifier) {
        let statemanager = proxy._dbTableAssignable.parentProxy._mysqlAssignable.contextStateManager;
        let primaryColumn = proxy._dbTableAssignable.tableInfo.columns.filter(x=>x.primary)[0].name;
        statemanager.deleteRow(proxy._dbTableAssignable.tableInfo.name, primaryColumn,primaryIdentifier);
      };
      deleteFunction.bind(proxy);
      return { value: deleteFunction, status: true };
    }
    return { value: false, status: false };
  }
}

module.exports = dbTableProxyHandler;