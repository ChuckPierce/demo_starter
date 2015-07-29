var exec = require('child_process').exec
var cmd = '/usr/local/google_appengine/dev_appserver.py ~/percolate/demo'

var runServer = {
    // command to execute python development server with demo directory
    child: undefined,

    serverLive: true,

    run: function (message, callback) {

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
                this.serverLive = false
            }
            console.log('stderr: ' + data)
        })

        this.child.on('close', function(code, signal) {
            if (!this.serverLive) message.textContent = "There is already an instance of the server running on your computer!  Close all other instances and try again!"
            console.log('closing code: ' + code)
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
