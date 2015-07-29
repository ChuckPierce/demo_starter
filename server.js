var exec = require('child_process').exec
var cmd = '/usr/local/google_appengine/dev_appserver.py ~/percolate/demo'

var runServer = {
    // command to execute python development server with demo directory
    child: undefined,

    run: function (message) {

        // create child process to start server and set maxBuffer to handle preloading assets
        this.child = exec(cmd,{maxBuffer:200*10024})

        // handle dev console logs and message changes
        this.child.stdout.on('data', function(data) {
            console.log('stdout: ' + data)
        })

        this.child.stderr.on('data', function(data) {
            if (data.indexOf('Starting admin server') > -1) {
                message.textContent = 'Server has started...starting webpack watch'
            }
            console.log('stderr: ' + data);
        })

        this.child.on('close', function(code, signal) {
            console.log(this.child)
            console.log('closing code: ' + code + ' ' + signal);
        })

        this.child.on('error', function(err) {
            console.log(err)
            message.textContent = "There was an error running the server.  Please restart"
        })
    },
    // kill process for restart
    kill: function () {
        this.child.kill();
    }

}

module.exports = runServer
