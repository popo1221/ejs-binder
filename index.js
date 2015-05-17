// setup for task-runner-js
var fs = require('fs');
var Loop = require('./src/loop');
var factory = require('./src/factory');
var taskConf = require('./task-conf.json');

var outputDir = process.env.html_output_dir || 'output';

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir);	
}

taskConf.forEach(function(task) {
	// Add output path
	task.output = task.output || outputDir + '/' + task.name + '.html';

	new Loop(factory(task), task.interval, task.name).run();
});


