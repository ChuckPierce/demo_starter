var gui = require('nw.gui')
var win = gui.Window.get()

var nativeMenuBar = new gui.Menu({ type: "menubar" });
nativeMenuBar.createMacBuiltin("Demo Starter");
win.menu = nativeMenuBar;

var exec = require('child_process').exec
var path = require('path')
var webpack = require('webpack')
var watchStarted = false

// command to execute python development server with demo directory
var cmd = '/usr/local/google_appengine/dev_appserver.py ~/percolate/demo'

// create child process to start server and set maxBuffer to handle preloading assets
var child = exec(cmd,{maxBuffer:200*10024})
//set root for OSX machines
var root = path.resolve(gui.App.dataPath, '../../..')

// handle dev console logs
child.stdout.on('data', function(data) {
    console.log('stdout: ' + data)
})
child.stderr.on('data', function(data) {
    if (data.indexOf('Starting admin server') > -1) {
        document.querySelector('.message').textContent = 'Server has started...starting webpack watch'
    }
    console.log('stderr: ' + data);
})
child.on('close', function(code, signal) {
    console.log('closing code: ' + code + ' ' + signal);
})

// start webpack watch for changes on js files when changing branches
var config = require(path.join(root, '/percolate/demo/ui/lib/config'))
var compiler = webpack(config.webpack)
var watcher = compiler.watch({
    aggregateTimeout: 300,
    poll: true
}, function(err, stats) {
    if (watchStarted) {
        document.querySelector('.message').textContent = 'A change has been made...still watching'
    } else {
        watchStarted = true
        document.querySelector('.message').textContent = 'watch has started...listening for changes'
    }
    console.log('Change has been made', stats)
})

// kill process on window close
win.on('close', function () {
    child.kill('SIGTERM')
    win.close(true)
})
