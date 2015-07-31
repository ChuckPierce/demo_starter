var app = require('app')
var BrowserWindow = require('browser-window')
var Menu = require('menu')

require('crash-reporter').start()

var mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit()
  }
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

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null
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
