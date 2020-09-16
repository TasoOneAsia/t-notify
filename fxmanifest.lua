fx_version 'cerulean'

game 'gta5'

author 'TasoAGC'
description 'A FiveM integration of the SimpleNotification.js library'
version '1.0.0'

client_scripts {
    'config.lua',
    'main.lua'
}

ui_page('nui/main.html')

files {
    'nui/main.html',
    'nui/SimpleNotification/notification.css',
    'nui/SimpleNotification/notification.js',
    'nui/script.js',
    'nui/styles.css'
}

exports {
    'SendAlert',
    'SendAny',
    'SendImage'
}