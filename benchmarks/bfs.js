var fs         = require('fs')
  , levelgraph = require("levelgraph")
  , async 		 = require('async')
  , graph = levelgraph("../importedLG");

graph = require('levelgraph-recursive')(graph);

async.waterfall([
	startBenchmarks("0", "160"),
	startBenchmarks("0", "170"),
	startBenchmarks("0", "190")
])


function startBenchmarks(from, to){
	return function(callback){
		console.time(to)
		graph.breadthFirst(from, "similar", to, function(err, triple) {
			console.log('From ' + from + ' to ' + to);
			console.timeEnd(to);
			callback();
		})
	}
}