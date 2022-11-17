CreateThread(function()
  local localName = GetCurrentResourceName()
  local resourceName = (localName == 't-notify') and "^2[t-notify]^0" or ("^2[t-notify] ^2(%s)^0"):format(localName)

  local function checkVersionHandler(respCode, respText)
    if respCode ~= 200 then
      print(("%s - Error in checking for update, error code %s"):format(resourceName, respCode))
    end

    local currVersion = GetResourceMetadata(localName, "version", 0)
    local latestVersion = json.decode(respText).tag_name:gsub("v", "")
    if currVersion > latestVersion then
      print(("You may be using a pre-release of %s. Your version: ^1%s^0, GitHub version: ^2%s"):format(resourceName, currVersion, latestVersion))
    elseif currVersion < latestVersion then
      print("\n^1###############################\n")

      local updateText = [[
	Your %s is currently ^1outdated^0.


	The latest stable version is ^2%s^0, your version is (^8%s^0)


	You can download the latest stable release from ^3https://github.com/TasoOneAsia/t-notify/releases/tag/%s^0
			]]
        print(updateText:format(resourceName, latestVersion, currVersion, latestVersion))

        print("^1############################### ^0")
    else
      print(resourceName.. '(v' .. latestVersion .. ") is up to date and has started")
    end
  end

  PerformHttpRequest("https://api.github.com/repos/TasoOneAsia/t-notify/releases/latest", checkVersionHandler, "GET")
end)