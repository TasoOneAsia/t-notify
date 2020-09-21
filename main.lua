--Debug Print Function
function DebugPrint(msg)
    if cfg.debugMode then
        print(msg)
    end
end

--Triggers a notification in the NUI using supplied params
function SendNotification(style, duration, title, message, image, sound, custom)
    if not style then
        print('T-Notify Error: Notification styling was equal to nil')
        return
    end
    SendNUIMessage({
        type = 'noti',
        style = style,
        time = duration,
        title = title,
        message = message,
        image = image,
        custom = custom
    })
    if sound then
        PlaySoundFrontend(-1, cfg.sound.name, cfg.sound.reference, 1)
    end
end

--Initialize's Config after activated by Thread
function InitConfig()
    local initObject = {
        type = 'init',
        position = cfg.position,
        insertAnim = cfg.animations.insertAnimation,
        insertDuration = cfg.animations.insertDuration,
        removeAnim = cfg.animations.removeAnimation,
        removeDuration = cfg.animations.removeDuration,
        maxNotifications = cfg.maxNotifications
    }
    DebugPrint('Sending Init Config: \n' .. json.encode(initObject))
    SendNUIMessage(initObject)
end

--Thread that triggers config initialization after UI Frame is created
Citizen.CreateThread(function()
    Wait(50)
    InitConfig()
end)

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
    DebugPrint('Notification | Style: ' .. style .. ' | Message: ' .. msg .. ' | Duration: ' ..duration .. ' | Sound: ' .. tostring(sound) .. ' | Custom: ' .. tostring(custom))
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

--Event Handlers from Server
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