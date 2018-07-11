/*
 Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var path = require("path"),
  mkdirp = require("mkdirp"),
  util = require("util"),
  fs = require("fs"),
  defaults = require("./common/defaults"),
  Report = require("./index"),
  TreeSummarizer = require("../util/tree-summarizer"),
  utils = require("../object-utils");

/**
 * a `Report` implementation that stores the coverage tree object to a json file
 *
 * Usage
 * -----
 *
 *      var report = require('istanbul').Report.create('json-tree');
 *
 * @class JsonTreeReporter
 * @extends Report
 * @module report
 * @constructor
 * @param {Object} opts optional
 * @param {String} [opts.dir] the directory in which to the text coverage report will be written, when writing to a file
 * @param {String} [opts.file] the filename for the report. When omitted, the report is written to console
 */
function JsonTreeReporter(opts) {
  Report.call(this);
  opts = opts || {};
  this.dir = opts.dir || process.cwd();
  this.file = opts.file;
  this.maxCols = opts.maxCols || 0;
  this.watermarks = opts.watermarks || defaults.watermarks();
}

JsonTreeReporter.TYPE = "json-tree";
util.inherits(JsonTreeReporter, Report);

Report.mix(JsonTreeReporter, {
  synopsis: function() {
    return "prints the coverage tree as JSON to a file";
  },
  getDefaultConfig: function() {
    return {
      file: "coverage-tree.json"
    };
  },
  writeReport: function(collector /*, sync */) {
    var summarizer = new TreeSummarizer(),
      tree;

    collector.files().forEach(function(key) {
      summarizer.addFileCoverageSummary(
        key,
        utils.summarizeFileCoverage(collector.fileCoverageFor(key))
      );
    });
    tree = summarizer.getTreeSummary();
    mkdirp.sync(this.dir);
    fs.writeFileSync(
      path.join(this.dir, this.file),
      JSON.stringify(tree),
      "utf8"
    );
    this.emit("done");
  }
});

module.exports = JsonTreeReporter;
