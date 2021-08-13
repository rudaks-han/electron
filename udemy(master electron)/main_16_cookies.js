// Modules
const {app, BrowserWindow, session } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  let ses = session.defaultSession;

  let getCookies = () => {
    ses.cookies.get({})
        .then(cookies => {
          console.log(cookies)
        })
        .catch( errors => {
          console.log(errors)
        })
  }

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')
  //mainWindow.loadURL('https://github.com')

  ses.cookies.remove('https://myappdomain.com', 'cookie1')
      .then(() => {
        getCookies()
      })
  /*let cookie = { url: 'https://myappdomain.com', name: 'cookie1', value: 'electron', expirationDate: 2622818789}

  ses.cookies.set(cookie)
      .then(() => {
        console.log('cookie1 set')
        getCookies()
      })*/

  /*mainWindow.webContents.on('did-finish-load', e => {
    getCookies()
  })*/

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
