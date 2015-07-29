var gui = require('nw.gui')
var win = gui.Window.get()

var nativeMenuBar = new gui.Menu({ type: "menubar" });
nativeMenuBar.createMacBuiltin("Demo Starter");
win.menu = nativeMenuBar;


var server = require('./server')
var watch = require('./watch')

var message = document.querySelector('.message')
var watchBtn = document.querySelector('.watch')
var serverBtn = document.querySelector('.server')

// run server
server.run(message)

// run watch
var watcher = watch.run(message, gui)
console.log(watcher)
// server button click
serverBtn.addEventListener('click', function () {
    server.kill()
    message.textContent = 'Server has stopped'
    watcher.close(function() {
        server.run(message)
        watcher = watch.run(message, gui)
    })
})

watchBtn.addEventListener('click', function () {
    watcher.close(function () {
        message.textContent = "restarting watch"
        watcher = watch.run(message, gui)
    })
})

// kill process on window close
win.on('close', function () {
    server.kill()
    win.close(true)
})
