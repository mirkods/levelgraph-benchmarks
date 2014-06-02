var fs         = require('fs')
  , levelgraph = require("levelgraph")
  , async     = require("async")
  , db         = levelgraph("importedLG");


var binaryCSV = require('binary-csv')
var parser = binaryCSV({separator:'\t', json: true});
var through2 = require('through2')
var nodes = [];

fs.createReadStream('./amazon0601.txt').pipe(parser);
parser.pipe(through2({objectMode: true}, function (chunk, enc, callback) {
  
  var data = {
    subject: chunk.from,
    predicate : 'similar',
    object: chunk.to
  }
  this.push(data)
  callback();
}),{highWaterMark:16}).pipe(db.putStream(),{highWaterMark:16});

// db.get({},function(err, list){ 
//   console.log(list.length);
//   async.each(list,function(triple, cb){
//     db.del(triple);
//     cb()    
//   })
// })