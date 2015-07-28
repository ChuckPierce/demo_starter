var gui = require('nw.gui')
var win = gui.Window.get()
var exec = require('child_process').exec
var path = require('path')
var webpack = require('webpack')
var cmd = '/usr/local/google_appengine/dev_appserver.py ~/percolate/demo'
var psTree = require('ps-tree')

var child = exec(cmd,{maxBuffer:200*10024})
var count = 0
var root = path.resolve(gui.App.dataPath, '../../..')


child.stdout.on('data', function(data) {
    console.log('stdout: ' + data)
})
child.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
    count++
})
child.on('close', function(code, signal) {
    console.log('closing code: ' + code + ' ' + signal);
    console.log(count)
})

var config = require(path.join(root, '/percolate/demo/ui/lib/config'))

var compiler = webpack(config.webpack)

compiler.watch({
    aggregateTimeout: 300,
    poll: true
}, function(err, stats) {
    console.log('Change has been made', stats)
})

win.on('close', function () {
    child.kill('SIGTERM')
    win.close(true)
})
