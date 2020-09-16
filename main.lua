local debugMode = false --Change this to toggle debug/dev prints

--Triggers a notification in the NUI using supplied params
function SendNotification(style, duration, title, message, image, sound)
    SendNUIMessage({
        style = style,
        time = duration,
        title = title,
        message = message,
        image = image,
        position = cfg.position
    })
    if sound then
        PlaySoundFrontend(-1, cfg.sound.name, cfg.sound.reference, 1)
    end
end

function DebugPrint(msg)
    if debugMode then
        print(msg)
    end
end
--[[
    SendTextAlert - Sends a notification alert with no title or image, just text.

    @param {string} style REQUIRED - parameter that determines the style of the notification. Look at readme for valid choices.

    @param {string} msg REQUIRED - text displayed by notification

    @param {integer} duration OPTIONAL - the display time of the notification in ms. Default value is 2500ms

    @param {bool} sound OPTIONAL - whether to play a sound when the notification is displayed. Default is false
 ]]

function SendTextAlert(style, msg, duration, sound)
    SendNotification(style, duration, nil, msg, nil, sound)
    DebugPrint('Notification | Style: ' .. style .. ' | Message: ' .. msg .. ' | Duration: ' ..duration .. ' | Sound: ' .. tostring(sound))
end

--[[
    SendAny - Sends a notification alert with params for all possible values

    @param {string} style REQUIRED - parameter that determines the style of the notification. Look at readme for valid choices.

    @param {string} title OPTIONAL - title displayed by notification

    @param {string} msg OPTIONAL - text displayed by notification

    @param {string URL} image OPTIONAL - url of image to display with notification

    @param {integer} duration OPTIONAL - the display time of the notification in ms. Default value is 2500ms

    @param {bool} sound OPTIONAL - whether to play a sound when the notification is displayed. Default is false

 ]]

function SendAny(style, title, msg, image, duration, sound)
    SendNotification(style, duration, title, msg, image, sound)
    DebugPrint('Notification | Style: ' .. style .. ' | Title: ' .. tostring(msg) .. ' | Message: ' .. tostring(msg) .. ' | Image URL: ' .. tostring(image) ..' | Duration: ' ..tostring(duration) .. ' | Sound: ' .. tostring(sound))
end

--[[
    SendImage - Sends a notification alert with only an image.

    @param {string} style REQUIRED - parameter that determines the style of the notification. Look at readme for valid choices.

    @param {string} title OPTIONAL - title displayed by notification

    @param {string URL} image REQUIRED - Image URL of image to be displayed by notification

    @param {integer} duration OPTIONAL - the display time of the notification in ms. Default value is 2500ms

    @param {bool} sound OPTIONAL - whether to play a sound when the notification is displayed. Default is false
 ]]

function SendImage(style, title, image, duration, sound)
    SendNotification(style, duration, title, nil, image, sound)
    DebugPrint('Notification | Style: ' .. style .. ' | Title: ' .. tostring(title) .. ' | Image: ' .. tostring(image) .. ' | Duration: ' ..duration .. ' | Sound: ' .. tostring(sound))
end

--Event Handlers from Server
RegisterNetEvent('tnotify:client:SendTextAlert')
AddEventHandler('tnotify:client:SendTextAlert', function(data)
    SendTextAlert(data.style, data.message, data.duration, data.sound)
end)

RegisterNetEvent('tnotify:client:SendAny')
AddEventHandler('tnotify:client:SendAny', function(data)
    SendAny(data.style, data.title, data.message, data.duration, data.image, data.sound)
end)

RegisterNetEvent('tnotify:client:SendImage')
AddEventHandler('tnotify:client:SendImage', function(data)
    SendImage(data.style, data.title, data.image, data.duration, data.sound)
end)