var fs = require('fs');
var scripts = require('./util/scriptFilter');
var tasks = fs.readdirSync('./gulp/tasks/').filter(scripts);

tasks.forEach(function(task) {
  require('./tasks/' + task);
});