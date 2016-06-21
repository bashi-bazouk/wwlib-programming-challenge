app = require('electron').app;
BrowserWindow = require('electron').BrowserWindow;
Menu =  require('electron').Menu;
mainWindow = null;

timely = require("timely")
webpack = require("webpack");
webpack_config = require("./client/webpack.config.js")


var topbar = [
    {
        label: 'Jibo',
        submenu: [
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function () { app.quit(); }
            },
        ]
    },
    {
        label: 'Debug',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'Command+R',
                click: function () {
                    BrowserWindow.getFocusedWindow().reloadIgnoringCache();
                }
            },
            {
                label: 'Toggle DevTools',
                accelerator: 'Alt+Command+I',
                click: function () {
                    BrowserWindow.getFocusedWindow().toggleDevTools();
                }
            }
        ]
    }
];

app.on('window-all-closed', function () {
    app.quit();
});


app.on('ready', function () {
    //set the context menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(topbar));

    mainWindow = new BrowserWindow({width: 1280, height: 720, resizable: true, title: "Electron/React - Brian P. Ledger" });

    compile_webpack = timely.promise(function(n) {
        return new Promise(function(resolve, reject) {
            webpack(webpack_config, function(error, stats) {
                if(!error){
                    resolve(stats)
                } else{
                    reject(error)
                }
            })
        })
    })

    compile_webpack(0).then(function(stats) {
        console.log("Compiling with webpack took " + (compile_webpack.time / 1000) + "s");
        mainWindow.loadURL("file://" + __dirname + "/serve/index.html");
    })

});