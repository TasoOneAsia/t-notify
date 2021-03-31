CreateThread(function()
	local updatePath = '/TasoOneAsia/t-notify'
	local resourceName = "^2["..GetCurrentResourceName().."]^0"

	function checkVersion(err,responseText, headers)
		local curVersion = LoadResourceFile(GetCurrentResourceName(), "version")
		if responseText == nil or curVersion == nil then
			print(resourceName..' - Update check failed. Response was nil')
		elseif curVersion ~= responseText and tonumber(curVersion) < tonumber(responseText) then
			print("\n###############################")
			print("\n" ..resourceName.." is outdated. \nThe latest stable version is "..responseText..", your version is ("..curVersion..")\n\nPlease download the latest stable build from https://github.com/TasoOneAsia/t-notify/")
			print("\n###############################")
		elseif(tonumber(curVersion) > tonumber(responseText)) then
			print("You may be using a pre-release of "..resourceName.." or GitHub went offline")
		else
			print(resourceName.. '(v' .. responseText .. ") is up to date and has started")
		end
	end

	PerformHttpRequest("https://raw.githubusercontent.com"..updatePath.."/master/version", checkVersion, "GET")
end)