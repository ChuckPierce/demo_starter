var app = require('app')
var BrowserWindow = require('browser-window')
var Menu = require('menu')
var exec = require('child_process').exec
var config = require('./config')
var dialog = require('dialog')
var demoPath

var crashReporter = require('crash-reporter')
crashReporter.start()

var mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    console.log('closed!')
    app.quit()
})

app.on('quit', function () {
  console.log('I quit!')
  config.clearPid()
})

app.on('gpu-process-crashed', function () {
  console.log('I crashed!')
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html')

  // set home directory
  global.homeDir = this.getHomeDir()
  config.saveDemoPath('')
  if (!config.getDemoPath()) {

    while(!demoPath) {
      demoPath = dialog.showOpenDialog(mainWindow, {title: 'Select demo directory', defaultPath: homeDir, properties: ['openDirectory']})
    }

    config.saveDemoPath(demoPath[0])
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.on('unresponsive', function () {
    console.log('the window is unresponsive')
    exec('kill ' + config.readPid())
  })
})

// Create default menu.
app.once('ready', function() {
  if (Menu.getApplicationMenu())
    return

  var template
  if (process.platform == 'darwin') {
    template = [
      {
        label: 'Demo Starter',
        submenu: [
          {
            label: 'About Demo Starter',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide Electron',
            accelerator: 'Command+H',
            selector: 'hide:'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:'
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() { app.quit() }
          },
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'Command+Z',
            selector: 'undo:'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+Command+Z',
            selector: 'redo:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:'
          },
          {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:'
          },
          {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Reset Demo Path',
            click: function () {
              config.saveDemoPath('')
              demoPath = ''

              while(!demoPath) {
                demoPath = dialog.showOpenDialog(mainWindow, {title: 'Select demo directory', defaultPath: homeDir, properties: ['openDirectory']})
              }

              config.saveDemoPath(demoPath[0])
            }
          },
        ]
      },
      {
        label: 'Window',
      },
    ]
  } else {
    template = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: function() {
              var focusedWindow = BrowserWindow.getFocusedWindow()
              if (focusedWindow)
                focusedWindow.close()
            }
          },
        ]
      },
      {
        label: '&View',
        submenu: [
          {
            label: '&Reload',
            accelerator: 'Ctrl+R',
            click: function() {
              var focusedWindow = BrowserWindow.getFocusedWindow()
              if (focusedWindow)
                focusedWindow.reload()
            }
          },
          {
            label: 'Toggle &Full Screen',
            accelerator: 'F11',
            click: function() {
              var focusedWindow = BrowserWindow.getFocusedWindow()
              if (focusedWindow)
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          },
          {
            label: 'Toggle &Developer Tools',
            accelerator: 'Shift+Ctrl+I',
            click: function() {
              var focusedWindow = BrowserWindow.getFocusedWindow()
              if (focusedWindow)
                focusedWindow.toggleDevTools()
            }
          },
        ]
    },
    ]
  }

  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})
