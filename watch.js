var path = require('path')
var webpack = require('webpack')

var jsWatcher = {
    compiler: undefined,
    watchStarted: false,
    watcher: undefined,
    run: function (message, gui, document) {
        // set root for OSX machines
        var root = path.resolve(gui.App.dataPath, '../../..')

        // start webpack watch for changes on js files when changing branches
        var config = require(path.join(root, '/percolate/demo/ui/lib/config'))

        // set webpack compiler to jsWatcher attribute
        this.compiler = webpack(config.webpack)
        // start webpack watch
        var watcher = this.compiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, function(err, stats) {
            if (err) {
                console.log(err)
            }

            var node = document.createElement('P')
            var debuggerConsole = document.querySelector('.debugger')
            if (stats.compilation.errors.length > 0) {
                stats.compilation.errors.forEach(function (error) {
                    var textNode = document.createTextNode(error.message)
                    node.appendChild(textNode)
                    node.style.color = 'red'
                    debuggerConsole.insertBefore(node, debuggerConsole.childNodes[0])
                })
            } else {
                var textNode = document.createTextNode('Compile successful')
                node.appendChild(textNode)
                node.style.color = 'green'
                debuggerConsole.insertBefore(node, debuggerConsole.childNodes[0])
            }

            if (this.watchStarted) {
                message.textContent = 'A change has been made...still watching'
            } else {
                this.watchStarted = true
                message.textContent = 'watch has started...listening for changes'
            }
            console.log('Change has been made', stats)
        })
        // return the watcher to be used
        return watcher
    },
}

module.exports = jsWatcher
