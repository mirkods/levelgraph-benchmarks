var fs         = require('fs')
  , levelgraph = require("levelgraph")
  , async     = require("async")
  , db         = levelgraph("importedLG");


var binaryCSV = require('binary-csv')
var parser = binaryCSV({separator:'\t', json: true});
var through2 = require('through2')
var nodes = [];


// FATAL ERROR: CALL_AND_RETRY_2 Allocation failed - process out of memory
fs.createReadStream('./amazon0601.txt',{highWaterMark:16}).pipe(parser);
parser.pipe(through2({objectMode: true}, function (chunk, enc, callback) {
  
  var data = {
    subject: chunk.from,
    predicate : 'similar',
    object: chunk.to
  }
  this.push(data)
  callback();
})).pipe(db.putStream());

// db.get({},function(err, list){ 
//   console.log(list.length);
//   async.each(list,function(triple, cb){
//     db.del(triple);
//     cb()    
//   })
// })