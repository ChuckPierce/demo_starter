var server = require('./server')
var watch = require('./watch')
var remote = require('remote')
var watcher
var DEBUG

var message = document.querySelector('.message')
var watchBtn = document.querySelector('.watch')
var serverBtn = document.querySelector('.server')
var debugBtn = document.querySelector('.debug-btn')
var debuggerConsole = document.querySelector('.debugger')

// run server
server.run(document, function () {
    // run watch
    watcher = watch.run(document)
})

// server button click
serverBtn.addEventListener('click', function () {
    server.kill('SIGTERM')
    message.textContent = 'Server has stopped'
    if(!watcher) watcher = watch.run(document)
    watcher.close(function() {
        server.run(document, function () {
            watcher = watch.run(document)
        })
    })
})

// watch button click
watchBtn.addEventListener('click', function () {
    watcher.close(function () {
        message.textContent = "restarting watch"
        watcher = watch.run(document)
    })
})

// console show and hide click
debugBtn.addEventListener('click', function () {
    if (DEBUG) {
        debuggerConsole.style.visibility = 'hidden'
        debugBtn.textContent = 'Show Console'
        DEBUG = false
    } else {
        debuggerConsole.style.visibility = 'visible'
        debugBtn.textContent = 'Hide Console'
        DEBUG = true
    }
})
