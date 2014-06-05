var fs = require('fs'),
  levelgraph = require("levelgraph"),
  async = require("async"),
  binaryCSV = require('binary-csv'),
  through2 = require('through2');

levelgraph("../importedLG", function (err, db) {

  var parser = binaryCSV({
      separator: '\t',
      json: true
    }),
    startTime = new Date(),
    count = 0;


  // fs.createReadStream('../amazon0601.txt').pipe(parser);
  fs.createReadStream('../amazonSmall.txt').pipe(parser);

  parser.pipe(through2({
    objectMode: true,
    highWaterMark: 16
  }, function (chunk, enc, callback) {

    var data = {
      subject: chunk.from,
      predicate: 'similar',
      object: chunk.to
    }
    this.push(data)

    if (++count % 10000 === 0) {

      setImmediate(callback);
    } else {
      callback()
    }
  }))
    .pipe(db.putStream({
        highWaterMark: 16
      })
      .on("close", function () {
        endTime = new Date();
        var totalTime = endTime - startTime;
        console.log("total time", totalTime);
        console.log("writes/s", count / totalTime * 1000);
      })
  );
});