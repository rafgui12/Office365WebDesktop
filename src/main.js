// Modules to control application life and create native browser window
const {app, BrowserWindow, session, shell} = require('electron');

const contextMenu = require('electron-context-menu');

contextMenu({
	showSaveImageAs: true
});

const path = require('path');

// define app defaults
const appDefaults = {
  homepage: 'https://www.office.com/',
  secondpage: 'https://www.office.com/?auth=1',
}

// global reference of the window object
const ses = session

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, './images/icon.fw.png'),
    title: 'Office365',
    autoHideMenuBar: true,
    width: 1040, 
    height: 640,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      popup: false,
      spellcheck: true
    }
  })
  
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  // Open the mainWindow
  ses.defaultSession.cookies.get({ name: 'JSHP'})
  .then((cookies) => {
    if(cookies == 0){
      mainWindow.loadURL(appDefaults.homepage)
    }else{
      mainWindow.loadURL(appDefaults.secondpage)
    }
  }).catch((error) => {
    console.log(error)
  })
  //mainWindow.loadURL(appDefaults.homepage)
  mainWindow.webContents.on('new-window', function(e, url) {
    const urlForb = [
      'https://outlook.com/', // Corregir el corrector de ortografico
      'https://teams.live.com/_?utm_source=OfficeWeb', // Abrir en el navegador o la app directa
      'https://to-do.microsoft.com/tasks/?auth=1', 
      'https://account.microsoft.com/family',
      'https://outlook.live.com/calendar/', //Corregir el corrector de ortografico
      'https://web.skype.com/?source=owa' // Abrir en el navegador o la app directa
      /*'https://onedrive.live.com/',
      'https://www.onenote.com/notebooks?auth=1', */
    ]
    for(let i = 0 ; i < urlForb.length; i++) {
      if(url === urlForb[i]){
        e.preventDefault();
        shell.openExternal(urlForb[i]); 
      }
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  //ses.defaultSession.clearStorageData()


  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
