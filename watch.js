var path = require('path')
var webpack = require('webpack')

var jsWatcher = {
    compiler: undefined,
    watchStarted: false,
    watcher: undefined,
    run: function (document, gui) {
        // set root for OSX machines
        var root = path.resolve(gui.App.dataPath, '../../..')
        var message = document.querySelector('.message')

        // start webpack watch for changes on js files when changing branches
        var config = require(path.join(root, '/percolate/demo/ui/lib/config'))
        config.webpack.devtool = 'eval'
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
                    console.log(error.message)
                    var errMessage = error.message.replace(/[\n]/g, '<br>')
                    node.innerHTML = errMessage
                    node.style.color = '#eb3e31'
                    debuggerConsole.insertBefore(node, debuggerConsole.childNodes[0])
                })
            } else {
                var textNode = document.createTextNode('Compile successful')
                node.appendChild(textNode)
                node.style.color = '#9fcb00'
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
