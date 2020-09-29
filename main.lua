--Debug Print Function
function DebugPrintInfo(style, duration, title, message, image, sound, custom)
    if cfg.debugMode then
        print('Notification | Style: ' .. style .. '\n | Title: ' .. tostring(title) .. '\n | Message: ' .. tostring(message) .. '\n | Image URL: ' .. tostring(image) ..'\n | Duration: ' ..tostring(duration) .. '\n | Sound: ' .. tostring(sound) .. '\n | Custom: ' .. tostring(custom))
    end
end

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
    DebugPrintInfo(string.lower(style), duration, title, message, image, sound, custom)
    SendNUIMessage({
        type = 'noti',
        style = string.lower(style),
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

--OBJECT STYLED EXPORTS
function Alert(data)
    SendNotification(data.style, data.duration, nil, data.message, nil, data.sound, data.custom)
end

function Custom(data)
    SendNotification(data.style, data.duration, data.title, data.message, data.image, data.sound, data.custom)
end

function Image(data)
    SendNotification(data.style, data.duration, data.title, nil, data.image, data.sound, data.custom)
end

--Event Handlers from Server (Objects)

RegisterNetEvent('t-notify:client:Alert')
AddEventHandler('t-notify:client:Alert', function(data)
    Alert({
        style = data.style,
        duration = data.duration,
        message = data.message,
        sound = data.sound,
        custom = data.custom
    })
end)

RegisterNetEvent('t-notify:client:Custom')
AddEventHandler('t-notify:client:Custom', function(data)
    Custom({
        style = data.style,
        duration = data.duration,
        title = data.title,
        message = data.message,
        image = data.image,
        sound = data.sound,
        custom = data.custom
    })
end)

RegisterNetEvent('t-notify:client:Image')
AddEventHandler('t-notify:client:Image', function(data)
    Image({
        style = data.style,
        duration = data.duration,
        title = data.title,
        image = data.image,
        sound = data.sound,
        custom = data.custom
    })
end)
