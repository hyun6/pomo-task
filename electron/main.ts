/* eslint-disable prettier/prettier */
import { BrowserWindow, app, ipcMain, crashReporter, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

const getYYYYMMDD = () => {
  const rightNow = new Date();
  return rightNow.toISOString().slice(0, 10).replace(/-/g, "");
};

const initLog = () => {
  const logPath = path.join(getUserDataPath(), 'logs', `electron-${getYYYYMMDD()}.log`);
  log.transports.file.file = logPath;
  //log.error('test');
};

let mainWindow: BrowserWindow;

const initUpdater = () => {
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
  });

  autoUpdater.on('update-available', (..._args) => {
    log.info('update-available');

    dialog.showMessageBox({ type: 'info', message: 'update?', buttons: ["OK", "CANCEL"] })
      .then(result => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall(true, true);
        }
      });
  });

  autoUpdater.on('update-not-available', (ev, info) => {
    log.info('Update not available.');
  });

  autoUpdater.on('error', (ev, err) => {
    log.info('Error in auto-updater.');
  });

  autoUpdater.on('download-progress', (ev, progressObj) => {
    log.info('Download progress...');
  });

  autoUpdater.on('update-downloaded', (ev, info) => {
    log.info('Update downloaded; will install in 5 seconds');
    autoUpdater.quitAndInstall(true, true);
  });

  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();
};

const getUserDataPath = () => {
  if (process.env.LOCALAPPDATA) {
    return path.join(process.env.LOCALAPPDATA, app.getName());
  } else {
    return app.getPath('appData');
  }
};

const initCrashReporter = () => {
  const dumpPath = path.join(getUserDataPath(), 'dump');
  if (!fs.existsSync(dumpPath)) {
    fs.mkdirSync(dumpPath, { recursive: true });
  }
  app.setPath('crashDumps', dumpPath);

  crashReporter.start({
    submitURL: '',
    compress: true,
    productName: 'electron-react-typescript-starter',
    uploadToServer: false,
  });
};

function createWindow() {

  app.setName('electron-react-typescript-starter');

  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    hasShadow: true,
    webPreferences: {
      preload: path.resolve(__dirname, './preload.js'),
    },
  });

  initLog();
  initCrashReporter();
  initUpdater();

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3333'
      : url.format({
        pathname: path.resolve(__dirname, '../../build/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
  );

  if (isDev)
    mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => mainWindow.destroy());

  ipcMain.handle('test', (_event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
    console.log(`test called!!!! : ${args}`);
  });

  // TEST: create crashdump
  // setTimeout(() => {
  //     process.crash();
  // }, 5000);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
