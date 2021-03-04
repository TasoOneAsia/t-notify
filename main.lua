local nuiReady

--Debug Print Function
function DebugPrintInfo(style, duration, title, message, image, sound, custom, position, persistent)
    if cfg.debugMode then
        print('Notification | Style: ' .. style .. '\n | Title: ' .. tostring(title) .. '\n | Message: ' .. tostring(message) .. '\n | Image URL: ' .. tostring(image) ..'\n | Duration: ' ..tostring(duration) .. '\n | Sound: ' .. tostring(sound) .. '\n | Custom: ' .. tostring(custom) .. '\n | Position: ' .. tostring(position) .. '\n | Persistent: ' .. tostring(persistent))
    end
end

function DebugPrint(msg)
    if cfg.debugMode then
        print(msg)
    end
end

--Triggers a notification in the NUI using supplied params
function SendNotification(style, duration, title, message, image, sound, custom, position)
    if not nuiReady then
        return print('NUI Frame not yet ready, you cannot send notifications')
    end
    if not style then
        return print('Notification styling was equal to nil')
    end
    DebugPrintInfo(string.lower(style), duration, title, message, image, sound, custom, position)
    SendNUIMessage({
        type = 'noti',
        style = string.lower(style),
        time = duration,
        title = title,
        message = message,
        image = image,
        custom = custom,
        position = position
    })
    if type(sound) == 'table' then
        PlaySoundFrontend(-1, sound.name, sound.reference, 1)
    elseif sound == true then
        PlaySoundFrontend(-1, cfg.sound.name, cfg.sound.reference, 1)
    end
end

--Triggers a notification using persistence
function SendPersistentNotification(step, id, options)
    if debugMode then
        print('PersistLog | ' ..'\nStep | ' .. step .. '\nID | ' .. id)
    end

    if not step or not id then
        return print('Persistent notifications must have a valid step and id')
    end

    if options then 
        DebugPrintInfo(options.style, options.duration, options.title, options.message, options.image, options.sound, options.custom, options.position, step .. ' ID: ' .. id)
        if not options.style then
            return print('Style must have a value, it cannot be nil')
        end
    end

    SendNUIMessage({
        type = 'persistNoti',
        step = step,
        id = id,
        options = options
    })
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

RegisterNUICallback('nuiReady', function()
    DebugPrint('NUI frame ready')
    nuiReady = true
    -- Send Config File after NUI frame ready
    InitConfig()
end)

--OBJECT STYLED EXPORTS
function Alert(data)
    SendNotification(data.style, data.duration, nil, data.message, nil, data.sound, data.custom, data.position)
end

function Custom(data)
    SendNotification(data.style, data.duration, data.title, data.message, data.image, data.sound, data.custom, data.position)
end

function Image(data)
    SendNotification(data.style, data.duration, data.title, nil, data.image, data.sound, data.custom, data.position)
end

function Persist(data)
    SendPersistentNotification(data.step, data.id, data.options)
end

--Event Handlers from Server (Objects)

RegisterNetEvent('t-notify:client:Alert')
AddEventHandler('t-notify:client:Alert', function(data)
    Alert({
        style = data.style,
        duration = data.duration,
        message = data.message,
        sound = data.sound,
        custom = data.custom,
        position = data.position
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
        custom = data.custom,
        position = data.position
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
        custom = data.custom,
        position = data.position
    })
end)

RegisterNetEvent('t-notify:client:Persist')
AddEventHandler('t-notify:client:Persist', function(data)
    Persist(data)
end)
