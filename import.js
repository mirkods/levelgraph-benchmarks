var fs         = require('fs')
  , levelgraph = require("levelgraph")
  , async     = require("async")
  , binaryCSV = require('binary-csv')
  , through2 = require('through2')

levelgraph("importedLG", function(err, db) {

  var parser = binaryCSV({separator:'\t', json: true})
    , count  = 0;

  // FATAL ERROR: CALL_AND_RETRY_2 Allocation failed - process out of memory
  fs.createReadStream('./amazon0601.txt').pipe(parser);
  parser.pipe(through2({objectMode: true, highWaterMark:16}, function (chunk, enc, callback) {
    
    var data = {
      subject: chunk.from,
      predicate : 'similar',
      object: chunk.to
    }
    this.push(data)

    if (++count % 1000 === 0) {
      console.log(count)
      // let the GC run from time to time
      setImmediate(callback);
    } else {
      callback()
    }
  })).pipe(db.putStream({highWaterMark:16}));
});



// db.get({},function(err, list){ 
//   console.log(list.length);
//   async.each(list,function(triple, cb){
//     db.del(triple);
//     cb()    
//   })
// })
