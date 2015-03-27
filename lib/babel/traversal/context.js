"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TraversalPath = _interopRequire(require("./path"));

var compact = _interopRequire(require("lodash/array/compact"));

var t = _interopRequireWildcard(require("../types"));

var TraversalContext = (function () {
  function TraversalContext(scope, opts, state, parentPath) {
    _classCallCheck(this, TraversalContext);

    this.parentPath = parentPath;
    this.scope = scope;
    this.state = state;
    this.opts = opts;
  }

  TraversalContext.prototype.create = function create(node, obj, key) {
    return TraversalPath.get(this.parentPath, this, node, obj, key);
  };

  TraversalContext.prototype.visit = function visit(node, key) {
    var nodes = node[key];
    if (!nodes) return;

    if (!Array.isArray(nodes)) {
      return this.create(node, node, key).visit();
    }

    // nothing to traverse!
    if (nodes.length === 0) {
      return;
    }

    var queue = [];

    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i]) queue.push(this.create(node, nodes, i));
    }

    for (var i = 0; i < queue.length; i++) {
      if (queue[i].visit()) {
        return true;
      }
    }
  };

  return TraversalContext;
})();

module.exports = TraversalContext;