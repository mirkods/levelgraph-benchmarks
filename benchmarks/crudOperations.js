var fs         = require('fs')
  , levelgraph = require("levelgraph")
  , async 		 = require('async')
  , graph 		= levelgraph("../importedLG");

async.waterfall([
	insert(10000),
	get(10000),
	update(),
	remove()
])


function get(counts){
	return function(cb){
		console.time('Get '+counts)
		graph.get({limit: counts}, function(err, list) {
			console.timeEnd('Get '+counts)
  		cb(null, list);
  	})
	}
}

function update(){
	return function(list, cb){
		console.time('Update '+list.length);
		async.each(list,function(elem, eachCb){
			graph.del(elem, function(err) {
		    elem.nodeId = '1';
		    graph.put(elem, function(err) {
		      eachCb();
		    })
		  })
		}, function(err){
			cb(null, list);
			console.timeEnd('Update '+list.length);
		})
	}
}


function remove(){
	return function(list, cb){
		console.time('Remove '+list.length);
		async.each(list,function(elem, eachCb){
			
			graph.del(elem, function(err){
				eachCb();
			})
		}, function(err){
			cb();
			console.timeEnd('Remove '+list.length);
		})
	}
}

function insert(counts){
	var _counts = counts;
	return function(cb){
		console.time('Insert '+counts);
		write = function() {
	  if(--counts === 0) {
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