fx_version 'cerulean'

game 'gta5'

author 'Taso'
description 'A FiveM integration of the SimpleNotification.js library'
version '2.0.0'
repository 'https://github.com/TasoOneAsia/t-notify'

client_scripts {
    'config.lua',
    'client/main.lua'
}

server_script 'server/update.lua'

ui_page 'nui/main.html'

files {
    'nui/main.html',
    'nui/SimpleNotification/notification.css',
    'nui/SimpleNotification/notification.js',
    'nui/assets/script.js',
    'nui/assets/styles.css',
    'nui/custom.css'
}