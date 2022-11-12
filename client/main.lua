local PersistentNotiMap = {}
local nuiReady

-- Debug Print Notification
local function DebugPrintInfo(data, persistent)
  if cfg.debugMode then
    print('Notification | Style: ' .. tostring(data.style) .. '\n | Title: ' .. tostring(data.title) .. '\n | Message: ' .. tostring(data.message) .. '\n | Image URL: ' .. tostring(data.image) ..'\n | Duration: ' ..tostring(data.duration) .. '\n | Sound: ' .. tostring(data.sound) .. '\n | Custom: ' .. tostring(data.custom) .. '\n | Position: ' .. tostring(data.position) .. '\n | Persistent: ' .. tostring(persistent))
  end
end

-- General Debug Print
local function DebugPrint(msg)
  if cfg.debugMode then
    print(msg)
  end
end

local function printError(msg)
  local errMsg = ('^1[T-Notify Error] %s'):format(msg)
  print(errMsg)
end

local function verifyTypes(notiTable, isPersistent)
  -- Might add more type validation here idk
  if not nuiReady then
    printError('NUI Frame is not ready yet')
    return false
  end

  if not notiTable.style or type(notiTable.style) ~= 'string' then
    printError('Style cannot be nil or must be a string for notifications')
    return false
  end

  if not isPersistent and (notiTable.duration and type(notiTable.duration) ~= 'number') then
    printError('Duration has to be a number for notifications')
    return false
  end

  if notiTable.sound and (type(notiTable.sound) ~= 'boolean' and type(notiTable.sound) ~= 'table') then
    printError('Sound property must be either a boolean or table for notifications')
    return false
  end

  if notiTable.position and type(notiTable.position) ~= 'string' then
    printError('Position property must be a string for this notifications')
    return false
  end

  if notiTable.image and type(notiTable.image) ~= 'string' then
    printError('The image property must be a string for this notifications')
    return false
  end

  if notiTable.icon and type(notiTable.icon) ~= 'string' then
    printError('The icon property must be a string for this notifications')
    return false
  end

  return true
end

--Triggers a notification in the NUI using supplied params
local function SendNotification(data)
  DebugPrintInfo(data)

  local areTypesValid = verifyTypes(data)

  if areTypesValid then
    SendNUIMessage(data)
    if type(sound) == 'table' then
      PlaySoundFrontend(-1, sound.name, sound.reference, 1)
    elseif sound == true then
      PlaySoundFrontend(-1, cfg.sound.name, cfg.sound.reference, 1)
    end
  end
end

--Triggers a notification using persistence
local function SendPersistentNotification(step, id, options)
  if debugMode then
    print('PersistLog | ' ..'\nStep | ' .. step .. '\nID | ' .. id)
  end

  if not step or not id then
    return printError('Persistent notifications must have a valid step and id')
  end

  local areTypesValid = true

  if options then
    DebugPrintInfo(options, step .. ' ID: ' .. id)
    areTypesValid = verifyTypes(options, true)
    if type(options.sound) == 'table' then
      PlaySoundFrontend(-1, options.sound.name, options.sound.reference, 1)
    elseif options.sound == true then
      PlaySoundFrontend(-1, cfg.sound.name, cfg.sound.reference, 1)
    end
  end

  if step == 'start' then
    PersistentNotiMap[id] = true
  elseif step == 'end' then
    PersistentNotiMap[id] = false
  end

  if areTypesValid then
    SendNUIMessage({
      type = 'persistNoti',
      step = step,
      id = id,
      options = options
    })
  end
end
--Initialize's Config after activated by Thread
local function InitConfig()
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

RegisterNUICallback('nuiReady', function(_, cb)
  DebugPrint('NUI frame ready')
  nuiReady = true
  -- Send Config File after NUI frame ready
  InitConfig()
  cb({})
end)

--OBJECT STYLED EXPORTS
function Alert(data)
  SendNotification({
    type = 'noti',
    style = data.style,
    duration = data.duration,
    title = nil,
    message = data.message,
    image = nil,
    sound = data.sound,
    custom = data.custom,
    position = data.position,
    icon = data.icon
  })
end

exports('Alert', Alert)

function Custom(data)
  SendNotification({
    type = 'noti',
    style = data.style,
    duration = data.duration,
    title = data.title,
    message = data.message,
    image = data.image,
    sound = data.sound,
    custom = data.custom,
    position = data.position,
    icon = data.icon
  })
end

exports('Custom', Custom)

function Image(data)
  SendNotification({
    type = 'noti',
    style = data.style,
    duration = data.duration,
    title = data.title,
    message = nil,
    image = data.image,
    sound = data.sound,
    custom = data.custom,
    position = data.position,
    icon = nil
  })
end

exports('Image', Image)

function Icon(data)
  SendNotification({
    type = 'noti',
    style = data.style,
    duration = data.duration,
    title = data.title,
    message = data.message,
    image = nil,
    sound = data.sound,
    custom = data.custom,
    position = data.position,
    icon = data.icon
  })
end

exports('Icon', Icon)

function Persist(data)
  SendPersistentNotification(data.step, data.id, data.options)
end

exports('Persist', Persist)

function IsPersistentShowing(id)
  return PersistentNotiMap[id] or false
end

exports('IsPersistentShowing', IsPersistentShowing)

--Event Handlers from Server (Objects)
RegisterNetEvent('t-notify:client:Alert', function(data)
  Alert({
    style = data.style,
    duration = data.duration,
    message = data.message,
    sound = data.sound,
    custom = data.custom,
    position = data.position
  })
end)

RegisterNetEvent('t-notify:client:Custom', function(data)
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

RegisterNetEvent('t-notify:client:Image', function(data)
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

RegisterNetEvent('t-notify:client:Icon', function(data)
  Icon({
    style = data.style,
    duration = data.duration,
    message = data.message,
    sound = data.sound,
    custom = data.custom,
    position = data.position,
    icon = data.icon
  })
end)

RegisterNetEvent('t-notify:client:Persist', function(data)
  Persist({
    step = data.step,
    id = data.id,
    options = data.options or nil
  })
end)