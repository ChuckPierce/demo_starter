var config = require('./config')
var exec = require('child_process').exec
var searchPID = config.readMainPid()

var interval = setInterval(checkForProcess, 5000)
function checkForProcess () {
    exec('kill -0 ' + searchPID, function (err, stout, sterr) {
        if (err !== null) {
            console.log('there is no process! kill the child')
            exec('kill ' + config.readPid())
            clearInterval(interval)
        } else {
            console.log('its still alive!')
        }
    })
}
