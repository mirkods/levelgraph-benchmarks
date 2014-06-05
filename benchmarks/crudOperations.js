var fs         = require('fs')
  , levelgraph = require("levelgraph")
  , async 		 = require('async')
  , graph 		= levelgraph("../importedLG");

var n = 10;
async.waterfall([
	insert(n),
	get(n),
	update(n),
	remove(n)
])


function get(counts){
	return function(cb){
		console.time('Get '+counts)
		graph.get({limit: counts}, function(err, list) {
			console.timeEnd('Get '+counts)
  		cb(null);
  	})
	}
}

function update(counts){
	var _counts = counts;
	return function(cb){
		console.time('Update '+ _counts);


		async.whilst(
			function() {
				return counts > 0;
			},
			function(whileCb) {
				var triple = {
		    	subject: "s" + counts,
		   	  predicate: "p" + counts,
		    	object: "o" + counts
		  	};
				graph.del(triple, function(err) {
			    triple.nodeId = '1';
			    graph.put(triple, function(err) {
						counts--;
			      whileCb();
			    });
			  });		
			},
			function(err) {
				console.timeEnd('Update '+ _counts);
				cb();
			}
		);
	}
}


function remove(counts){
	var _counts = counts;
	return function(cb){
		console.time('Remove '+_counts);
		async.whilst(
			function() {
				return counts > 0;
			},
			function(whileCb) {
				counts--;
				var triple = {
		    	subject: "s" + counts,
		   	  predicate: "p" + counts,
		    	object: "o" + counts
		  	};
		  	graph.del(triple, function(err){
					whileCb();
				});				
			},
			function(err) {
				console.timeEnd('Remove '+_counts);
				cb();
			}
		);
		
	}
}

function insert(counts){
	var _counts = counts;
	return function(cb){
		console.time('Insert '+counts);
		write = function() {
	  if(counts-- === 0) {
			console.timeEnd('Insert '+_counts);
			cb();
	    return;
	  }
	  var triple = {
	    subject: "s" + counts,
	    predicate: "p" + counts,
	    object: "o" + counts
	  };
	  graph.put(triple, write);
	};

	write();

	}
}