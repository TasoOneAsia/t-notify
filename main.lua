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

function SendTextAlert(style, msg, duration, sound)
    SendNotification(style, duration, nil, msg, nil, sound)
end

function SendAny(style, title, msg, duration, image, sound)
    SendNotification(style, duration, title, msg, image, sound)
end

function SendImage(style, title, image, duration, sound)
    SendNotification(style, duration, title, nil, image, sound)
end

RegisterNetEvent('tnotify:client:SendTextAlert')
AddEventHandler('tnotify:client:SendTextAlert', function(data) --data.style, data.msg, data.duration, data.sound
    SendTextAlert(data.style, data.message, data.duration, data.sound)
end)

RegisterNetEvent('tnotify:client:SendAny')
AddEventHandler('tnotify:client:SendAny', function(data) --data.style, data.title, data.message, data.duration, data.image, data.sound
    SendAny(data.style, data.title, data.msg, data.duration, data.image, data.sound)
end)

RegisterNetEvent('tnotify:client:SendImage')
AddEventHandler('tnotify:client:SendImage', function(data)
    SendNotification(data.style, data.title, data.image, data.duration, data.sound)
end)

RegisterCommand('tnotify:example', function(_, args)
    SendNotification('error', 2500, 'NICE ONE BUD', nil, 'https://tasoagc.dev/u/61Gg0W.png', true)
end)