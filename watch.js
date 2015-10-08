var path = require('path')
var webpack = require('./node_modules/webpack')
var homeDir = require('remote').getGlobal('homeDir')
var ProgressPlugin = require('./node_modules/webpack/lib/ProgressPlugin')
var debuggerConsole = document.querySelector('.debugger')
var progress = document.querySelector('.progress')
var configPath = require('./config')
var buildMsg

var jsWatcher = {
    compiler: undefined,
    watchStarted: false,

    run: function (document) {
        // set root for OSX machines
        var root = homeDir
        var message = document.querySelector('.message')
        console.log()

        // start webpack watch for changes on js files when changing branches
        var config = require(path.join(configPath.getDemoPath(), '/ui/lib/config'))

        config.webpack.devtool = 'eval'
        // set webpack compiler to jsWatcher attribute
        this.compiler = webpack(config.webpack)
        // display watch progress
        this.compiler.apply(new ProgressPlugin(function(percentage, msg) {
                if(percentage < 1) {
                    percentage = Math.floor(percentage * 100)
                    msg = percentage + "% " + msg
                    if(percentage < 100) msg = " " + msg
                    if(percentage < 10) msg = " " + msg
                }
                // console.log(msg)
                if(buildMsg !== msg) {
                    progress.textContent = msg
                    buildMsg = msg
                }
            }))
        // start webpack watch
        var watcher = this.compiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, function(err, stats) {
            if (err) {
                console.log('there was an error')
                console.log(err)
                throw err
            }
            if (stats.hasErrors()) {
                console.log('there were errors')
                throw new Error('there were errors')
            }
            var node = document.createElement('P')
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
