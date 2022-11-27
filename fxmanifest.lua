fx_version 'cerulean'

game 'gta5'

lua54 'yes'

author 'Taso'
description 'A FiveM integration of the SimpleNotification.js library'
version '2.1.0'
repository 'https://github.com/TasoOneAsia/t-notify'

client_scripts {
    'config.lua',
    'client/main.lua',
    'client/history.lua'
}

server_script 'server/update.lua'

ui_page 'nui/main.html'

files {
    'nui/main.html',
    'nui/SimpleNotification/notification.css',
    'nui/SimpleNotification/notification.js',
    'nui/assets/*.js',
    'nui/assets/styles.css',
    'nui/custom.css'
}