var exec = require('child_process').exec
var cmd = '/usr/local/google_appengine/dev_appserver.py ~/percolate/demo'
var watch = require('./watch')
var watcher

var runServer = {
    // command to execute python development server with demo directory
    child: undefined,

    serverLive: true,

    run: function (document, callback, gui, newCMD) {
        if (newCMD) cmd = newCMD
        var message = document.querySelector('.message')
        // create child process to start server and set maxBuffer to handle preloading assets
        this.child = exec(cmd,{maxBuffer:200*10024})

        // handle dev console logs and message changes
        this.child.stdout.on('data', function(data) {
            console.log('stdout: ' + data)
        })

        this.child.stderr.on('data', function(data) {
            if (data.indexOf('Starting admin server') > -1) {
                message.textContent = 'Server has started...starting webpack watch'
                callback()
            } else if (data.indexOf('Unable to bind localhost') > -1) {
                console.log('in here')
                runServer.serverLive = false
            }
            console.log('stderr: ' + data)
        })

        this.child.on('close', function(code, signal) {
            if (!runServer.serverLive) message.textContent = "There is already an instance of the server running on your computer!  Close all other instances and try again!"
            console.log('closing code: ' + code)
            if (code === 1 && runServer.serverLive) {
                runServer.kill('SIGTERM')
                runServer.run(document, function() {
                    watcher = watch.run(message, gui, document)
                }, gui, '/usr/local/google_appengine/dev_appserver.py ~/demo')
            }
        })

        this.child.on('error', function(err) {
            console.log(err)
            message.textContent = "There was an error running the server.  Please restart"
        })
    },
    // kill process for restart
    kill: function (signal) {
        this.child.kill(signal)
    }

}

module.exports = runServer
