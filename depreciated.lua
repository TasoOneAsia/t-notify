--[[
    SendTextAlert - Sends a notification alert with no title or image, just text.

    @param {string} style REQUIRED - parameter that determines the style of the notification. Look at readme for valid choices.

    @param {string} msg REQUIRED - text displayed by notification

    @param {integer} duration OPTIONAL - the display time of the notification in ms. Default value is 2500ms

    @param {bool} sound OPTIONAL - whether to play a sound when the notification is displayed. Default is false

    @param {bool} custom OPTIONAL - must be set to true if the notification style is a custom addition.
 ]]

function SendTextAlert(style, msg, duration, sound, custom)
    SendNotification(style, duration, nil, msg, nil, sound, custom)
    DebugPrint('Notification | Style: ' .. tostring(style) .. ' | Message: ' .. tostring(msg) .. ' | Duration: ' ..tostring(duration) .. ' | Sound: ' .. tostring(sound) .. ' | Custom: ' .. tostring(custom))
end

--[[
    SendAny - Sends a notification alert with params for all possible values

    @param {string} style REQUIRED - parameter that determines the style of the notification. Look at readme for valid choices.

    @param {string} title OPTIONAL - title displayed by notification

    @param {string} message OPTIONAL - text displayed by notification

    @param {string URL} image OPTIONAL - url of image to display with notification

    @param {integer} duration OPTIONAL - the display time of the notification in ms. Default value is 2500ms

    @param {bool} sound OPTIONAL - whether to play a sound when the notification is displayed. Default is false

    @param {bool} custom OPTIONAL - must be set to true if the notification style is a custom addition.
 ]]

function SendAny(style, title, message, image, duration, sound, custom)
    SendNotification(style, duration, title, message, image, sound, custom)
    DebugPrint('Notification | Style: ' .. style .. ' | Title: ' .. tostring(title) .. ' | Message: ' .. tostring(message) .. '\n | Image URL: ' .. tostring(image) ..' | Duration: ' ..tostring(duration) .. ' | Sound: ' .. tostring(sound) .. ' | Custom: ' .. tostring(custom))
end

--[[
    SendImage - Sends a notification alert with only an image.

    @param {string} style REQUIRED - parameter that determines the style of the notification. Look at readme for valid choices.

    @param {string} title OPTIONAL - title displayed by notification

    @param {string URL} image REQUIRED - Image URL of image to be displayed by notification

    @param {integer} duration OPTIONAL - the display time of the notification in ms. Default value is 2500ms

    @param {bool} sound OPTIONAL - whether to play a sound when the notification is displayed. Default is false
    
    @param {bool} custom OPTIONAL - must be set to true if the notification style is a custom addition.
]]

function SendImage(style, title, image, duration, sound, custom)
    SendNotification(style, duration, title, nil, image, sound, custom)
    DebugPrint('Notification | Style: ' .. style .. ' | Title: ' .. tostring(title) .. ' | Image: ' .. tostring(image) .. ' | Duration: ' ..duration .. ' | Sound: ' .. tostring(sound).. ' | Custom: ' .. tostring(custom))
end

RegisterNetEvent('tnotify:client:SendTextAlert')
AddEventHandler('tnotify:client:SendTextAlert', function(data)
    SendTextAlert(data.style, data.message, data.duration, data.sound, data.custom)
end)

RegisterNetEvent('tnotify:client:SendAny')
AddEventHandler('tnotify:client:SendAny', function(data)
    SendAny(data.style, data.title, data.message, data.image, data.duration, data.sound, data.custom)
end)

RegisterNetEvent('tnotify:client:SendImage')
AddEventHandler('tnotify:client:SendImage', function(data)
    SendImage(data.style, data.title, data.image, data.duration, data.sound, data.custom)
end)