// Modules
const {app, BrowserWindow, dialog} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')

  mainWindow.webContents.on('did-finish-load', () => {
    /*dialog.showOpenDialog(mainWindow, {
      buttonLabel: 'Select a photo',
      defaultPath: app.getPath('home'),
      properties: ['multiSelections', 'createDirectory', 'openFile', 'openDirectory']
    }).then(result => {
      console.log(result)
    })*/

    /*dialog.showSaveDialog({}).then(result => {
      console.log(result)
    })*/

    const answers = ['Yes', 'No', 'Maybe']
    dialog.showMessageBox({
      title: 'Message Box',
      message: 'Please select an option',
      detail: 'Message details',
      buttons: answers
    }).then(result => {
      console.log(`User selected: ${answers[result.response]}`)
    })
  })
  // Open DevTools - Remove for PRODUCTION!
  //mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
