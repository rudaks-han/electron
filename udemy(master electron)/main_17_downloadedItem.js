// Modules
const {app, BrowserWindow, session} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  let ses = session.defaultSession;

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')

  ses.on('will-download', (e, downloadItem, webContents) => {
    let fileName = downloadItem.getFilename()
    let fileSize = downloadItem.getTotalBytes()

    console.log(downloadItem)
    downloadItem.setSavePath(app.getPath('desktop') + `/${fileName}`)

    downloadItem.on('updated', (e, state) => {

      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (downloadItem.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`fileSize: ${fileSize}`)
          console.log(`Received bytes: ${downloadItem.getReceivedBytes()}`)
        }
      }

      let received = downloadItem.getReceivedBytes();

      console.log('fileSize: ' + fileSize)
      if (state === 'progressing' && received) {
        let progress = Math.round((received/fileSize) * 100)
        console.log(progress)

        //webContents.executeJavaScript(`window.progress.value = ${progress}`)
      }
    })
  })

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(`console.log("hello");`); // <--- this does not execute with electron-3.0.0-beta.1
  });


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
