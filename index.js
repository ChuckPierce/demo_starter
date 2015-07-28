var gui = require('nw.gui')
var win = gui.Window.get()
var exec = require('child_process').exec
var path = require('path')
var webpack = require('webpack')
var cmd = '/usr/local/google_appengine/dev_appserver.py ~/percolate/demo'
var psTree = require('ps-tree')

var child = exec(cmd)

var root = path.resolve(gui.App.dataPath, '../../..')


child.stdout.on('data', function(data) {
    console.log('stdout: ' + data)
})
child.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
})
child.on('close', function(code) {
    console.log('closing code: ' + code);
})

var config = require(path.join(root, '/percolate/demo/ui/lib/config'))

var compiler = webpack(config.webpack)

compiler.watch({
    aggregateTimeout: 300,
    poll: true
}, function(err, stats) {
    console.log('Change has been made', stats)
});

var kill = function (pid, signal, callback) {
    signal   = signal || 'SIGINT';
    callback = callback || function () {}
    var killTree = true;
    if(killTree) {
        psTree(pid, function (err, children) {
            var pidArr = []
            pidArr.push(pid)
            pidArr.concat(
                children.map(function (p) {
                    return p.PID;
                })
            ).forEach(function (tpid) {
                try { process.kill(tpid, signal) }
                catch (ex) { }
            })
            callback()
        });
    } else {
        try { process.kill(pid, signal) }
        catch (ex) { }
        callback()
    }
}

win.on('close', function () {
    kill(child.pid, 'SIGINT', function() {
        console.log('killed')
        win.close(true)
    })
})
