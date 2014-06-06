var fs         = require('fs')
  , levelgraph = require("levelgraph")
  , graph = levelgraph("../importedLG");

graph = require('levelgraph-recursive')(graph);


var stream = graph.searchStream([{
    subject: "1",
    predicate: "similar",
    object: graph.v("x")
  },{
    subject: graph.v("x"),
    predicate: "similar",
    object: graph.v("a")
  }]);
stream.on("data", function(data) {
    // this will print "{ x: 'daniele', y: 'marco' }"
    console.log(data);
  });
