cfg = {
    position = 'top-right', --Changes the position of the notifications
	maxNotifications = 0, --Max notifications to show on screen (0 indicates no limit)
    sound = { --Change the alert sound
        name = '5_SEC_WARNING',
        reference = 'HUD_MINI_GAME_SOUNDSET'
	},
	animations = {
		insertAnimation = 'insert-right', --Possible animation types: 'insert-left', 'insert-right', 'insert-top', 'insert-bottom', 'fadein', 'scalein' and 'rotatein'
		insertDuration = 1000, -- Duration of the insert animation
		removeAnimation = 'fadeout', -- Possible animation types: 'fadeout', 'scaleout', 'rotateout'
		removeDuration = 600, -- Duration of the remove animation
	},
	debugMode = false -- Toggle developer prints
}