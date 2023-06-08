-- Type: the required type(s) for the argument
-- Required: is the argument required
-- Persistent: ignore argument if the notification is persistent
local NOTI_TYPES <const> = {
  style = { type = "string", required = true, persistent = false },
  duration = { type = "number", required = false, persistent = true },
  sound = { type = { "boolean", "table" }, required = false, persistent = false },
  position = { type = "table", required = false, persistent = false },
  image = { type = "string", required = false, persistent = false },
  icon = { type = "string", required = false, persistent = false }
}
local PersistentNotiMap = {}
local nuiReady

-- Debug Print Notification
local function DebugPrintInfo(data, persistent)
  if cfg.debugMode then
    print('Notification | Style: ' .. tostring(data.style) .. '\n | Title: ' .. tostring(data.title) .. '\n | Message: ' .. tostring(data.message) .. '\n | Image URL: ' .. tostring(data.image) .. '\n | Icon: ' .. tostring(data.icon) ..'\n | Duration: ' .. tostring(data.duration) .. '\n | Sound: ' .. tostring(data.sound) .. '\n | Custom: ' .. tostring(data.custom) .. '\n | Position: ' .. tostring(data.position) .. '\n | Persistent: ' .. tostring(persistent))
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

local function checkTypes(argVal, types)
  for i = 1, #types do
    if type(argVal) == types[i] then
      return true
    end
  end

  return false
end

local function verifyTypes(notiTable, isPersistent)
  local usePersistent, notiVal, hasTypes
  for typeKey, v in pairs(NOTI_TYPES) do
    usePersistent = v.persistent and isPersistent or false
    notiVal = notiTable[typeKey]
    hasTypes = type(v.type) == 'table' and checkTypes(notiVal, v.type) or type(notiVal) == v.type

    if v.required then
      if not notiVal or not hasTypes then
        printError(('Invalid %s type for %s notification. Expected %s, got %s.'):format(typeKey, isPersistent and 'persistent' or 'non-persistent', type(v.type == 'table') and table.concat(v.type, ' or ') or v.type, type(notiVal)))
        return false
      end
    else
      if not isPersistent and notiVal and not hasTypes then
        printError(('Invalid %s type for %s notification. Expected %s, got %s.'):format(typeKey, isPersistent and 'persistent' or 'non-persistent', type(v.type == 'table') and table.concat(v.type, ' or ') or v.type, type(notiVal)))
        return false
      end
    end
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
    PersistentNotiMap[id] = nil
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
    maxNotifications = cfg.maxNotifications,
    useHistory = cfg.useHistory,
    historyPosition = cfg.historyPosition,
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
RegisterNetEvent('t-notify:client:Alert', Alert)

RegisterNetEvent('t-notify:client:Custom', Custom)

RegisterNetEvent('t-notify:client:Image', Image)

RegisterNetEvent('t-notify:client:Icon', Icon)

RegisterNetEvent('t-notify:client:Persist', Persist)