var fs         = require('fs')
  , levelgraph = require("levelgraph")
  , async 		 = require('async')
  , graph = levelgraph("../importedLG");

graph = require('levelgraph-recursive')(graph);

async.waterfall([	
	startBenchmarks("70", "170")

])


function startBenchmarks(from, to){
	return function(callback){
		console.time(to)
		graph.deepFirst(from, "similar", to, function(err, triple) {
			console.log('From ' + from + ' to ' + to);
			console.timeEnd(to);
			callback();
		})
	}
}