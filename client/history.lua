local cbHistory = nil

if cfg.useHistory then
  local activeHistory = false

  local function setHistoryActivity(active)
    activeHistory = active
    SendNUIMessage({
      type = 'history',
      visible = active
    })
    SetNuiFocus(active, active)
  end

  RegisterCommand(cfg.historyCommand, function()
    setHistoryActivity(not activeHistory)
  end)

  RegisterNUICallback('historyClose', function()
    setHistoryActivity(false)
  end)

  exports('SetHistoryVisibility', setHistoryActivity)
  exports('GetHistoryVisibility', function()
    return activeHistory
  end)
end

local function RemoveNotification(id)
  if type(id) == 'number' then
    SendNUIMessage({
      type = 'removeHistoryNoti',
      id = id
    })
  end
end

exports('RemoveNotification', RemoveNotification)

local function ClearHistory()
  SendNUIMessage({
    type = 'clearHistory'
  })
end

exports('ClearHistory', ClearHistory)

local function GetHistory()
  cbHistory = promise.new()
  SendNUIMessage({
    type = 'getHistory'
  })

  return Citizen.Await(cbHistory)
end

exports('GetHistory', GetHistory)

RegisterNUICallback('getHistory', function(data, cb)
  cbHistory:resolve(data)
  cbHistory = nil
  cb({})
end)