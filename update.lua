CreateThread(function()
	local localName = GetCurrentResourceName()
	local resourceName = (localName == 't-notify') and "^2[t-notify]^0" or ("^2[t-notify] ^2(%s)^0"):format(localName)

	local function checkVersionHandler(respCode, responseText)
		local curVersion = LoadResourceFile(localName, "version")

		if not responseText or not curVersion then
			print(("^1%s - Update failed response was nil"):format(resourceName))
		elseif curVersion ~= responseText and tonumber(curVersion) < tonumber(responseText) then
			print("\n^1###############################\n")

			local updateText = [[
	Your %s is currently ^1outdated^0.


	The latest stable version is ^2%s^0, your version is (^8%s^0)


	You can download the latest stable release from https://github.com/TasoOneAsia/t-notify/
			]]

			print(updateText:format(resourceName, responseText, curVersion))

			print("^1###############################")
		elseif(tonumber(curVersion) > tonumber(responseText)) then
			print(("You may be using a pre-release of %s. Your version: ^1%s^0, GitHub version: ^2%s"):format(resourceName, curVersion, responseText))
		elseif respCode < 200 or respCode > 299 then
			print(("%s - Error in checking for update, error code %s"):format(resourceName, errCode))
		else
			print(resourceName.. '(v' .. responseText .. ") is up to date and has started")
		end
	end

	PerformHttpRequest("https://raw.githubusercontent.com/TasoOneAsia/t-notify/master/version", checkVersionHandler, "GET")
end)