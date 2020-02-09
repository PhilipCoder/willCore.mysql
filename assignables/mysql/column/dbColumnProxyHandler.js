const baseProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler");

class dbColumnProxyHandler extends baseProxyHandler {
  constructor() {
    super();
    this.getTraps.unshift(this.assignPrimaryKey);
    this.setTraps.unshift(this.assignSize);
    this.getTraps.unshift(this.assignIndex);
  }

  assignPrimaryKey(target, property, proxy) {
    if (property === "primary") {
      proxy._dbColumnAssignable.columnInfo.primary = true;
      return { value: true };
    }
    return { value: false, status: false };
  }

  assignSize(target, property, value, proxy) {
    if (property === "size" && (typeof value === "number" || (Array.isArray(value) && value.length > 0))) {
      proxy._dbColumnAssignable.columnInfo.size = value;
      return { value: true };
    }
    return { value: false, status: false };
  }

  assignIndex(target, property, proxy) {
    if (property === "index") {
      proxy._dbColumnAssignable.columnInfo.indexed = true;
      return { value: true };
    }
    return { value: false, status: false };
  }

}

module.exports = dbColumnProxyHandler;