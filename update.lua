Citizen.CreateThread(function()
	local updatePath = '/TasoOneAsia/t-notify'
	local resourceName = "\x1b[32m["..GetCurrentResourceName().."]\x1b[0m"
	function checkVersion(err,responseText, headers)
		local curVersion = LoadResourceFile(GetCurrentResourceName(), "version")
		if responseText == nil or curVersion == nil then
			print(resourceName..' - Update check failed. Response was nil')
		elseif curVersion ~= responseText and tonumber(curVersion) < tonumber(responseText) then
			print("\n###############################")
			print("\n" ..resourceName.." is outdated. \nThe latest stable version is "..responseText..", your version is ("..curVersion..")\n\nPlease download the latest stable build from https://github.com/TasoOneAsia/t-notify/")
			print("\n###############################")
		elseif(tonumber(curVersion) > tonumber(responseText)) then
			print("You somehow skipped a few versions of "..resourceName.." or GitHub went offline, if GitHub is still online please try and update your resource")
		else
			print(resourceName.. '(v' .. responseText .. ") is up to date and has started")
		end
	end
	PerformHttpRequest("https://raw.githubusercontent.com"..updatePath.."/master/version", checkVersion, "GET")
end)