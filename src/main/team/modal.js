const { remote } = require('electron');
const dialog = require('electron').remote.dialog
const ipcRenderer = require('electron').ipcRenderer

let teamImage = document.getElementById('team_image')
let teamName = document.getElementById('team_name')

let cancelButton = document.getElementById('cancel_button')
let createButton = document.getElementById('create_button')


teamImage.addEventListener('click', e => {
    dialog.showOpenDialog({
        defaultPath : remote.app.getPath('desktop'),
        filters : [
            { name : 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg']}
        ]
    }).then( result => {
        if(!result.canceled){
            teamImage.src = result.filePaths[0]
        }
    })
})

cancelButton.addEventListener('click', e => {
    remote.getCurrentWindow().close()
})

createButton.addEventListener('click', e => {
    ipcRenderer.send('new-team', {
        picture : teamImage.src,
        name : teamName.value
    })

    remote.getCurrentWindow().close()
})

