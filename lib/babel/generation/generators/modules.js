"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.ImportSpecifier = ImportSpecifier;
exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
exports.ExportSpecifier = ExportSpecifier;
exports.ExportAllDeclaration = ExportAllDeclaration;
exports.ExportNamedDeclaration = ExportNamedDeclaration;
exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
exports.ImportDeclaration = ImportDeclaration;
exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
exports.__esModule = true;

var each = _interopRequire(require("lodash/collection/each"));

var t = _interopRequireWildcard(require("../../types"));

function ImportSpecifier(node, print) {
  print(node.imported);
  if (node.local && node.local !== node.imported) {
    this.push(" as ");
    print(node.local);
  }
}

function ImportDefaultSpecifier(node, print) {
  print(node.local);
}

function ExportSpecifier(node, print) {
  print(node.local);
  if (node.exported && node.local !== node.exported) {
    this.push(" as ");
    print(node.exported);
  }
}

function ExportAllDeclaration(node, print) {
  this.push("export * from ");
  print(node.source);
  this.semicolon();
}

function ExportNamedDeclaration(node, print) {
  this.push("export ");
  ExportDeclaration.call(this, node, print);
}

function ExportDefaultDeclaration(node, print) {
  this.push("export default ");
  ExportDeclaration.call(this, node, print);
}

function ExportDeclaration(node, print) {
  var specifiers = node.specifiers;

  if (node.declaration) {
    print(node.declaration);
    if (t.isStatement(node.declaration)) return;
  } else {
    this.push("{");
    if (specifiers.length) {
      this.space();
      print.join(specifiers, { separator: ", " });
      this.space();
    }
    this.push("}");

    if (node.source) {
      this.push(" from ");
      print(node.source);
    }
  }

  this.ensureSemicolon();
}

function ImportDeclaration(node, print) {
  this.push("import ");

  if (node.isType) {
    this.push("type ");
  }

  var specfiers = node.specifiers;
  if (specfiers && specfiers.length) {
    var foundImportSpecifier = false;

    for (var i = 0; i < node.specifiers.length; i++) {
      var spec = node.specifiers[i];

      if (i > 0) {
        this.push(", ");
      }

      if (!t.isImportDefaultSpecifier(spec) && !t.isImportNamespaceSpecifier(spec) && !foundImportSpecifier) {
        foundImportSpecifier = true;
        this.push("{ ");
      }

      print(spec);
    }

    if (foundImportSpecifier) {
      this.push(" }");
    }

    this.push(" from ");
  }

  print(node.source);
  this.semicolon();
}

function ImportNamespaceSpecifier(node, print) {
  this.push("* as ");
  print(node.local);
}