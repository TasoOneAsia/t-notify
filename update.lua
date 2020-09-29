Citizen.CreateThread(function()
	local updatePath = '/TasoOneAsia/t-notify'
	local resourceName = "T-Notify ("..GetCurrentResourceName()..")"
	function checkVersion(err,responseText, headers)
		local curVersion = LoadResourceFile(GetCurrentResourceName(), "version")
		if responseText == nil or curVersion == nil then
			print('\n'..resourceName..' - Update check failed. Response was nil')
		elseif curVersion ~= responseText and tonumber(curVersion) < tonumber(responseText) then
			print("\n###############################")
			print("\n"..resourceName.." is outdated. The Current Version is \n"..responseText.."is:\n"..curVersion.."\nPlease download the latest stable build from https://github.com/TasoOneAsia/t-notify/")
			print("\n###############################")
		elseif(tonumber(curVersion) > tonumber(responseText)) then
			print("You somehow skipped a few versions of "..resourceName.." or GitHub went offline, if GitHub is still online please try and update your resource")
		else
			print("\n"..resourceName.." is up to date")
		end
	end
	PerformHttpRequest("https://raw.githubusercontent.com"..updatePath.."/UPD/version", checkVersion, "GET")
end)