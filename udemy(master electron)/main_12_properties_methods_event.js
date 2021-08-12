// Modules
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    minWidth: 300, minHeight: 150,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  secondWindow = new BrowserWindow({
    width: 300, height: 200,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')
  secondWindow.loadFile('index.html')

  // Open DevTools - Remove for PRODUCTION!
  //mainWindow.webContents.openDevTools();

  secondWindow.on('closed', () => {
    mainWindow.maximize();
  })
  /*mainWindow.on('focus', () => {
    console.log('main window focus')
  })
  secondWindow.on('focus', () => {
    console.log('second window focus')
  })

  app.on('browser-window-focus', () => {
    console.log('App focused')
  })

  console.log(BrowserWindow.getAllWindows())*/
  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
  secondWindow.on('closed',  () => {
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
