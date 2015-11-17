var server = require('./server')
var watch = require('./watch')
var remote = require('remote')
var config = require('./config')
var exec = require('child_process').exec
var watcher
var DEBUG

var message = document.querySelector('.message')
var watchBtn = document.querySelector('.watch')
var serverBtn = document.querySelector('.server')
var startBtn = document.querySelector('.start')
var debugBtn = document.querySelector('.debug-btn')
var debuggerConsole = document.querySelector('.debugger')

// set pid and start checker
config.savePid('mainPid', process.pid)
exec('node ./checker')

remote.getCurrentWindow().on('close', function () {
    server.kill('SIGTERM')
})

startBtn.addEventListener('click', function () {
    exec('if test -d '+ config.getDemoPath() +'/ui/node_modules; then echo "exist"; fi', function (err, stout, sterr) {
        console.log(stout)
        if(stout) {
            startServer()
        } else {
            message.textContent = "installing dependencies"
            var install = exec('cd ' + config.getDemoPath() + '/ui && npm install')

            install.stdout.on('data', function(data) {
                console.log(data)
            })

            install.stderr.on('data', function(data) {
                console.log(data)
            })

            install.on('close', function(code, signal) {
            console.log('closing code: ' + code)
            if (code === 0) {
                message.textContent = "install complete, restart server"
            }
        })
        }
    })

})

// server button click
serverBtn.addEventListener('click', function () {
    killandRestart()
})

// watch button click
watchBtn.addEventListener('click', function () {
    if (watcher) {
        watcher.close(function () {
            message.textContent = "watch stopped"
            watcher = null
            watchBtn.textContent = 'start watch'
            console.log('watch stopped')
        })
    } else {
        watchBtn.textContent = 'stop watch'
        message.textContent = "starting watch"
        watcher = watch.run(document)
        console.log('restarting watch')
    }
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

function killandRestart () {
    server.kill('SIGTERM')
    message.textContent = 'Server has stopped'
    if(!watcher) watcher = watch.run(document)
    watcher.close(function() {
        server.run(document, function () {
            watcher = watch.run(document)
        })
    })
}

function startServer () {
    if(config.readPid()) {
        exec('kill ' + config.readPid(), function (err, stout, sterr) {
            console.log(err)
            console.log(stout)
            console.log(sterr)
            server.run(document, function () {
                // run watch
                watcher = watch.run(document)
            })
            startBtn.classList.add('hide')
            serverBtn.classList.remove('hide')
            watchBtn.classList.remove('hide')
        })
    } else {
        server.run(document, function () {
                // run watch
                watcher = watch.run(document)
            })
        startBtn.classList.add('hide')
        serverBtn.classList.remove('hide')
        watchBtn.classList.remove('hide')
    }
}
