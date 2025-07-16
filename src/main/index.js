'use strict'

import { logger } from './../renderer/utils/logger'
import { createLocalStore } from './../renderer/utils/LocalStore'
import {
  app,
  globalShortcut,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  screen
} from 'electron'
import { init as websocketInit } from './sockets'

const electron = require('electron')
const path = require('path')
const localStore = createLocalStore()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, tray
const winURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`

app.disableHardwareAcceleration()

app.whenReady().then(() => {
  logger.info('app ready')
  createWindow()
  const minToTray = localStore.get('minToTray')
  const alwaysOnTop = localStore.get('alwaysOnTop')

  if (minToTray) {
    createTray()
  }

  // this must be set after window has been created on ubuntu 18.04
  mainWindow.setAlwaysOnTop(alwaysOnTop)

  // remove menu to stop the window being closed on Ctrl+W. See #121
  mainWindow.setMenu(null)

  // load shortcuts from storage
  loadGlobalShortcuts(localStore.get('globalShortcuts'))

  // launch local websocket on port 1314
  websocketInit(1314)
})

app.on('window-all-closed', () => {
  logger.info('quitting app...')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('toggle-alwaysOnTop', (event, arg) => {
  mainWindow.setAlwaysOnTop(arg)
})

let breakAlwaysOnTop

ipcMain.on('toggle-breakAlwaysOnTop', (event, arg) => {
  breakAlwaysOnTop = arg
  if (breakAlwaysOnTop === false) {
    mainWindow.setAlwaysOnTop(true)
  }
})

ipcMain.on('onBreak', (event, arg) => {
  if (breakAlwaysOnTop === true) {
    mainWindow.setAlwaysOnTop(!arg)
  }
})

ipcMain.on('toggle-minToTray', (event, arg) => {
  if (arg) {
    createTray()
  } else {
    tray.destroy()
  }
})

// ====== 开机自启动相关 ======
// 设置开机自启动
function setAutoLaunch(enable) {
  app.setLoginItemSettings({
    openAtLogin: enable
  })
}
// 查询当前自启动状态
function isAutoLaunchEnabled() {
  return app.getLoginItemSettings().openAtLogin
}
// 监听渲染进程消息
ipcMain.on('set-auto-launch', (event, enable) => {
  setAutoLaunch(enable)
})
ipcMain.handle('get-auto-launch', () => {
  return isAutoLaunchEnabled()
})

ipcMain.on('window-close', (event, arg) => {
  mainWindow.close()
})

ipcMain.on('window-minimize', (event, arg) => {
  if (arg) {
    mainWindow.hide()
  } else {
    mainWindow.minimize()
  }
})

ipcMain.on('tray-icon-update', (event, image) => {
  const nativeImg = nativeImage.createFromDataURL(image)
  tray.setImage(nativeImg)
})

ipcMain.on('reload-global-shortcuts', (event, shortcuts) => {
  // reload shortcuts when they are modified.
  logger.info('reload global shortcuts')
  globalShortcut.unregisterAll()
  loadGlobalShortcuts(shortcuts)
})

function getNewWindowPosition() {
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  const electronScreen = electron.screen
  const primaryDisplay = electronScreen.getPrimaryDisplay()

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  )

  // Position window 4 pixels vertically below the tray icon
  // Adjust according if tray is at the bottom
  let y = Math.round(trayBounds.y + trayBounds.height + 4)
  if (y > primaryDisplay.workAreaSize.height) {
    y = trayBounds.y - trayBounds.height - windowBounds.height
  }

  return { x: x, y: y }
}

function toggleWindow() {
  if (mainWindow === null) {
    createWindow()
  } else {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  }

  if (process.platform === 'darwin') {
    const position = getNewWindowPosition()
    mainWindow.setPosition(position.x, position.y, false)
  }
}

function createTray() {
  const trayIconFile =
    process.platform === 'darwin' ? 'icon--macos--tray.png' : 'icon.png'
  tray = new Tray(path.join(__static, trayIconFile))
  tray.setToolTip('Pomotroid\nClick to Restore')
  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: 'View',
      click: function() {
        toggleWindow()
      }
    },
    {
      label: 'Exit',
      click: function() {
        app.isQuiting = true
        app.quit()
      }
    }
  ])
  tray.on('click', () => {
    toggleWindow()
  })
  tray.setContextMenu(contextMenu)
}

function createWindow() {
  const alwaysOnTop = localStore.get('alwaysOnTop')
  mainWindow = new BrowserWindow({
    alwaysOnTop,
    backgroundColor: '#2F384B',
    fullscreenable: false,
    frame: false,
    icon:
      process.platform === 'darwin'
        ? path.join(__static, 'icon--macos.png')
        : path.join(__static, 'icon.png'),
    resizable: false,
    useContentSize: true,
    width: 360,
    height: 478,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.loadURL(winURL)

  // send event to renderer on window restore
  mainWindow.on('restore', () => {
    mainWindow.webContents.send('win-restore')
  })

  // send event to renderer on window show
  mainWindow.on('show', () => {
    mainWindow.webContents.send('win-show')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function loadGlobalShortcuts(globalShortcuts) {
  Object.keys(globalShortcuts).forEach(key => {
    logger.info(`Registering shortcut for ${key}: ${globalShortcuts[key]}`)
    globalShortcut.register(globalShortcuts[key], () => {
      logger.info(`Command received: ${key}`)
      mainWindow.webContents.send('event-bus', key)
    })
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// 在主进程文件末尾添加锻炼弹窗相关代码
let exerciseWindow = null

function createExerciseWindow(message = '请休息一下，做几次深呼吸。', duration = 30) {
  console.log('createExerciseWindow 被调用', message, duration)
  if (exerciseWindow) {
    exerciseWindow.destroy()
  }

  // 获取主屏幕的尺寸，让弹窗固定在屏幕正中间
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

  // 弹窗占屏幕大小的80%
  const popupWidth = Math.round(screenWidth * 0.8)
  const popupHeight = Math.round(screenHeight * 0.8)
  // 计算屏幕正中间的坐标
  const popupX = Math.round((screenWidth - popupWidth) / 2)
  const popupY = Math.round((screenHeight - popupHeight) / 2)

  // 获取主窗口的主题色变量并传递给弹窗
  mainWindow.webContents.executeJavaScript(
    "getComputedStyle(document.documentElement).getPropertyValue('--color-accent-light').trim()"
  ).then((accentColor) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:9080/exercise.html?msg=${encodeURIComponent(message)}&duration=${duration}&color=${encodeURIComponent(accentColor)}`
        : `file://${__dirname}/exercise.html?msg=${encodeURIComponent(message)}&duration=${duration}&color=${encodeURIComponent(accentColor)}`
    exerciseWindow = new BrowserWindow({
      width: popupWidth,
      height: popupHeight,
      x: popupX,
      y: popupY,
      resizable: false,
      frame: false,
      alwaysOnTop: true,
      backgroundColor: '#00000000', // 透明
      transparent: true,
      parent: mainWindow, // 让弹窗在主窗口之上
      modal: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })
    exerciseWindow.loadURL(url)
    exerciseWindow.on('closed', () => {
      // console.log('exerciseWindow 已关闭')
      exerciseWindow = null
    })
    // 主进程定时强制关闭弹窗（已删除）
    // setTimeout(() => {
    //   if (exerciseWindow) {
    //     exerciseWindow.destroy()
    //     exerciseWindow = null
    //   }
    // }, duration * 1000)
  })
}

// 监听渲染进程的 IPC 触发
ipcMain.on('show-exercise-reminder', (event, { message, duration }) => {
  // console.log('收到 show-exercise-reminder IPC', message, duration)
  createExerciseWindow(message, duration)
})

ipcMain.on('exercise-remaining-update', (event, seconds) => {
  if (exerciseWindow) {
    exerciseWindow.webContents.send('exercise-remaining-update', seconds)
  }
})

ipcMain.on('close-exercise-window', () => {
  if (exerciseWindow) {
    exerciseWindow.destroy()
    exerciseWindow = null
  }
})

ipcMain.on('skip-exercise-and-close', () => {
  // console.log('收到跳过休息请求')
  if (exerciseWindow) {
    exerciseWindow.destroy()
    exerciseWindow = null
  }
  if (mainWindow) {
    mainWindow.webContents.send('skip-break-round')
  }
})
