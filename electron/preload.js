const { contextBridge, ipcRenderer, crashReporter } = require('electron');

// ref electron : // https://github.com/electron/electron/blob/master/docs/tutorial/context-isolation.md
// ref vscode : https://github.com/microsoft/vscode/blob/99b13b8fbfea262f03d4ec818c857003b463c7b2/src/vs/base/parts/sandbox/electron-browser/preload.js

(function () {
  'use strict';

  const globals = {
    // TODO: Add your APIs export to renderer
    test: (...args) => ipcRenderer.invoke('test', ...args),

    /**
     * Support for subset of methods of Electron's `crashReporter` type.
     */
    crashReporter: {
      /**
       * @param {string} key
       * @param {string} value
       */
      addExtraParameter(key, value) {
        crashReporter.addExtraParameter(key, value);
      },
    },

    /**
     * A minimal set of methods exposed from Electron's `ipcRenderer`
     * to support communication to main process.
     */
    ipcRenderer: {
      invoke(channel, ...args) {
        if (validateIPC(channel)) {
          ipcRenderer.invoke(channel, ...args);
        }
      },
      send(channel, ...args) {
        if (validateIPC(channel)) {
          ipcRenderer.send(channel, ...args);
        }
      },
      on(channel, listener) {
        if (validateIPC(channel)) {
          ipcRenderer.on(channel, listener);
        }
      },
      once(channel, listener) {
        if (validateIPC(channel)) {
          ipcRenderer.once(channel, listener);
        }
      },
      removeListener(channel, listener) {
        if (validateIPC(channel)) {
          ipcRenderer.removeListener(channel, listener);
        }
      },
    },
  };

  function validateIPC(channel) {
    // TODO: Add your prefix channel name rule
    if (!channel /*|| !channel.startsWith('API:')*/) {
      throw new Error(`Unsupported event IPC channel '${channel}'`);
    }

    return true;
  }

  // Use `contextBridge` APIs to expose globals to API
  // only if context isolation is enabled, otherwise just
  // add to the DOM global.
  try {
    contextBridge.exposeInMainWorld('API', globals);
  } catch (error) {
    console.error(error);
  }
})();
