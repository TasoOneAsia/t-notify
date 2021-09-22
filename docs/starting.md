## Installation & Download

**From Releases**
* Visit [releases](https://github.com/TasoOneAsia/t-notify/releases/)
* Download and unzip the latest release
* Rename the directory to ``t-notify``, if not already.
* Place ``t-notify`` in your ``resources`` directory

**Using Git**
cd resources
git clone https://github.com/TasoOneAsia/t-notify.git t-notify

**Start**

Add the following to your server.cfg before any resources that have `t-notify` as a dependency

	ensure t-notify

## Intial Config

T-Notify includes a small config that allows for various changes to how the resource operates. This can be found in the ``config.lua`` file.

	cfg = {
	    position = 'top-right', -- Changes the position of the notifications
		maxNotifications = 0, --Max notifications to show on screen (0 indicates no limit)
	    sound = { -- Change the alert sound
	        name = '5_SEC_WARNING',
	        reference = 'HUD_MINI_GAME_SOUNDSET'
		},
		animations = {
			insertAnimation = 'insert-right', -- Possible animation types: 'insert-left', 'insert-right', 'insert-top', 'insert-bottom', 'fadein', 'scalein' ,'rotatein'
			insertDuration = 1000, 
			removeAnimation = 'fadeout', -- Possible animation types: 'fadeout', 'scaleout', 'rotateout'
			removeDuration = 600 
		},
		debugMode = true --Toggle developer prints
	}

* **Position** - Will change the positioning of the notifications (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, middle-left, middle-right)
* **maxNotifications** - The max number of notifications to show on-screen at once.
* **Sound** - Allows for the change of the notification alert sound. Reference [this](https://wiki.gtanet.work/index.php?title=FrontEndSoundlist) for options.
	* *name* - Sound Name
	* *reference* - Sound Set Name
* **Animations** - Allows for the customization of notification animations
	* *insertAnimation*- Insert animation ('insert-left', 'insert-right', 'insert-top', 'insert-bottom', 'fadein', 'scalein' and 'rotatein')
	* *insertDuration* - Insert animation duration in *ms*
	* *removeAnimation* - Remove animation ('fadeout', 'scaleout', 'rotateout')
	* *removeDuration* - Remove animation duration in *ms*
* **debugMode** - Toggle showing developer prints in console.
