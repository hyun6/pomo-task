declare global {
  interface Window {
    API: MyApi;
  }
}

export interface MyApi {
  test(...args): void;
  crashReporter: {
    addExtraParameter(key: string, value: string);
  };
  ipcRenderer: {
    invoke(channel, ...args);
    send(channel, ...args);
    on(channel, listener);
    once(channel, listener);
    removeListener(channel, listener);
  };
}
