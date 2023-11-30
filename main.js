const { app, BrowserWindow, Tray, Menu, protocol } = require("electron");
const path = require("path");

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL("https://music.youtube.com");
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const x = width - (micWindow.getBounds().width - 20);
  const y = 0;
  micWindow.setPosition(x, y);

  mainWindow.on("close", function (event) {
    if (app.quitting) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });

  // Agregar el ícono a la barra de notificaciones
  const iconPath = path.join(__dirname, "icon_bartool.png"); // Reemplaza 'path-to-your-icon.png' con la ruta a tu icono
  tray = new Tray(iconPath);

  tray.setToolTip("YTM CLI");

  // Manejar doble clic en el ícono para mostrar/ocultar la ventana
  tray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

app.on("ready", () => {
  createWindow();

  // Configuración para ocultar la aplicación en el dock en macOS
  if (process.platform === "darwin") {
    app.dock.hide();

    protocol.registerFileProtocol("app", (request, callback) => {
      const url = request.url.replace("app://", "");
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    });

    app.setAsDefaultProtocolClient("app");
  }
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.exit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// Manejar el evento 'before-quit' para limpiar la bandeja
app.on("before-quit", () => {
  tray.destroy();
});
