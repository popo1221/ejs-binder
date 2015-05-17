// factory.js
var Q = require('q');
var fs = require('fs');
var fetch = require('node-fetch');

// test with native promise on node 0.11, and bluebird for node 0.10
fetch.Promise = fetch.Promise || require('bluebird');

var ejs = require('./templates');

// The tmp file's suffix
var tmpSuffix = '.tmp';

/**
 * Test whether specified object is an array.  
 */
function isArray(obj) {
	return (obj instanceof Array);
}

function fetchData(url, key) {
	return Q.Promise(function(resolve, reject) {
		fetch(url)
			.then(function(res) {
				// TODO: handle failed
				// return res.json();
				return res.text();
			})
			.then(function(data) {
				resolve({key: key, value: data});
			});
	});
}

function factory(task) {
	function dataMap(map) {
		var key, name, promises = [];

		if (map) {
			for (key in map) {
				promises.push(fetchData(map[key].url, key));
			}
		}

		if (promises.length) {
			return promises.length > 1 ? Q.all(promises) : promises[0];
		} else {
			return  Q.Promise(function(resolve) { resolve(); });
		}
	}

	function render(results) {
		var context = null;
		if (isArray(results)) {
			context = {};
			results.forEach(function(item) {
				context[item.key] = item.value;
			});
		} else {
			context = results;
		}

		var html = ejs.render(task.template, context);

		return html;
	}

	function writeFile(html) {
		return Q.nfcall(fs.writeFile, task.output + tmpSuffix, html);
	}

	function rename() {
		return Q.nfcall(fs.rename, task.output + tmpSuffix, task.output);
	}

	function end(err) {
		if (err) {
			// TODO: log error
			console.log(err);
		}
	}


	return function() {
		return Q.Promise(function(resolve, reject) {
			dataMap(task.dataMap)
				.then(render)
				.then(writeFile)
				.then(rename)
				.then(end)
				.done(resolve);
		});
	};
}

module.exports = factory;