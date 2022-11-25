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

  RegisterCommand('notihistory', function()
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