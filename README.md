
# T-Notify

A FiveM implementation of the lightweight [SimpleNotification.js](https://github.com/Glagan/SimpleNotification) library created by [Glagan](https://github.com/Glagan/)

## Table of Contents

1. [Features](https://github.com/TasoOneAsia/t-notify#features)
2. [Screenshots](https://github.com/TasoOneAsia/t-notify#screenshots)
3. [Installation & Download](https://github.com/TasoOneAsia/t-notify#installation--download)
4. [Configuration](https://github.com/TasoOneAsia/t-notify#config)
5. [Styles & Customization](https://github.com/TasoOneAsia/t-notify#styles)
6. [Utilization](https://github.com/TasoOneAsia/t-notify#utilization)
7. [Supported Markdown](https://github.com/TasoOneAsia/t-notify#supported-markdown-formatting)

## Features

* Notification queue system

* Notification positioning

* *Markdown-like* formatting

* Sound alerts when notifications are triggered

* User defined custom styling

* Highly configurable

## Screenshots

![Info styling](https://tasoagc.dev/u/trvQOP.png)
![Error styling](https://tasoagc.dev/u/dVReJl.png)
![Warning styling](https://tasoagc.dev/u/9Oh1es.png)
![Successstyling](https://tasoagc.dev/u/aAweMy.png)


## Installation & Download



**Using Git**

	cd resources
	git clone https://github.com/TasoOneAsia/t-notify.git t-notify
**Manually**
 * Visit [releases](https://github.com/TasoOneAsia/t-notify/releases/)
 * Download and unzip the latest release
 * Rename the directory to ``t-notify``
 * Place ``t-notify`` in your ``resources`` directory

**Start**

Add the following to your server.cfg before any resources that have `t-notify` as a dependency

	ensure t-notify

## Config



T-Notify includes a small config that allows for various changes to how the resource operates. This can be found in the ``config.lua`` file.

	cfg = {
	    position = 'top-right', -- Changes the position of the notifications
	    sound = { -- Change the alert sound
	        name = '5_SEC_WARNING',
	        reference = 'HUD_MINI_GAME_SOUNDSET'
		},
		animations = {
			insertAnimation = 'insert-right', -- Possible animation types: 'insert-left', 'insert-right', 'insert-top', 'insert-bottom', 'fadein', 'scalein' and 'rotatein'
			insertDuration = 1000, -- Duration of the insert animation
			removeAnimation = 'fadeout', -- Possible animation types: 'fadeout', 'scaleout', 'rotateout'
			removeDuration = 600 -- Duration of the remove animation
		}
	}
	
* **Position** - Will change the positioning of the notifications (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
* **Sound** - Allows for the change of the notification alert sound. Reference [this](https://wiki.gtanet.work/index.php?title=FrontEndSoundlist) for options.
	* *name* - Audio Name
	* *reference* - Audio Group
* **Animations** - Allows for the customization of notification animations
	* *insertAnimation*- Insert animation ('insert-left', 'insert-right', 'insert-top', 'insert-bottom', 'fadein', 'scalein' and 'rotatein')
	* *insertDuration* - Insert animation duration in *ms*
	* *removeAnimation* - Remove animation ('fadeout', 'scaleout', 'rotateout')
	* *removeDuration* - Remove animation duration in *ms*

## Styles



*These are used when passing the `style` parameter*

**Default Styles**
* Info
* Error
* Warning
* Success

**Custom Styles**

T-Notify allows for the addition of custom user-specified classes in the custom.css file that can be used in conjunction with the default styles. By default, there is an example notification style included in the custom.css that can be used as a reference but here is a short guide

**Custom Classes Guide**

	/* This snippet is taken from custom.css, in the 'nui' directory */
	
	/* Always attempt to keep user edited CSS to this file only, unless you know what you are doing  */

	.gn-example {
    	background-color: pink;
    	color: black;
    	text-shadow: 0 1px 1px white;
	}

This example above shows a custom style that can be invoked whenever a notification is sent. Custom styles ***MUST*** have their CSS class **always** prefixed by `gn-` otherwise they will not work correctly. 

**Invoking a Custom Style**

In order to use a custom style when invoking a notification, the parameter ``custom`` ***MUST*** also be set to true. We'll use the example styling for this snippet:

	TriggerClientEvent('tnotify:client:SendAny', source, {
        style = 'example',
        duration = 6000,
        title = 'Markdown Formatting Example',
        message = '``Code``\n **Bolded Text** \n *Italics Yo* \n # Header 1\n ## Header 2\n',
        sound = true,
        custom = true
    })

*This snippet produces the following notification:*

![Example Styled Notification](https://tasoagc.dev/u/0tiWNE.png)

On the other hand, if we **forget** to set the `custom` parameter as **True** the following error will be produced:

```javascript
Uncaught TypeError: SimpleNotification[noti.style] is not a function
```

## Utilization



T-Notify notifications can be triggered from either Client-Side or Server-Side.

**Function Descriptions**

*SendTextAlert* - Send an alert styled notification with just a message, no title, no image.

*SendAny* - Send a custom notification according to parameters chosen by you.

*SendImage* - Send a image with an optional title


**How to Use Exported Functions (Client Side)**

To call a notification from the client, insert an export into your code like the example below:

Lua Example:
```lua
-- This sends a notification with the 'info' styling, an example messsage, a duration of 5500ms, and an audio alert

exports['t-notify']:SendTextAlert('info', 'This is an example message', 5500, true)
```
**Available Client Exports**
* SendTextAlert (style, message, duration, sound, custom)
	* Style STRING (Required) - One of the available styles as listed above.
	* Message STRING (Required) - Message to display in the notification.
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
	* Custom BOOL (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. Defaults to false.
* SendAny (style,  title,  message,  image,  duration, sound, custom)
	* Style STRING (Required) - One of the available styles as listed above .
	* Title STRING (Optional) - Title to display in the notification. Defaults to nil
	* Message STRING (Optional) - Message to display in the notification. Defaults to nil
	* Image STRING (Optional) - Accepts an Image URL to embed into the notification. Defaults to nil
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
	* Custom BOOL (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. Defaults to false.
* SendImage (style,  title,  image,  duration,  sound, custom)
	* Style STRING (Required) - One of the available styles as listed above .
	* Title STRING (Optional) - Title to display in the notification. Defaults to nil
	* Image STRING (Required) - Accepts an Image URL to embed into the notification
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
	* Custom BOOL (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. Defaults to false.

**How to Use T-Notify Client Events (Server-Side)**

To call a notification from the server-side, insert a TriggerClientEvent into your code like the *Lua* example below:
	
``` lua
local player = 'ServerID of receiving client'

TriggerClientEvent('tnotify:client:SendTextAlert', player, {
	style  =  'error',
	duration  =  10500,
	message  =  'Alert Test',
	sound  =  true
})
```

*Unlike the export on the client side, the TriggerClientEvent requires that parameters **must** be placed in an object, as shown in the example above*

**Available Client Events (Server-Side)**

* SendTextAlert ( style, message, duration, sound, custom)
	* Style STRING (Required) - One of the available styles as listed above.
	* Message STRING (Required) - Message to display in the notification.
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
	* Custom BOOL (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. Defaults to false.
* SendAny (style,  title,  message,  image,  duration, sound, custom)
	* Style STRING (Required) - One of the available styles as listed above .
	* Title STRING (Optional) - Title to display in the notification. Defaults to nil
	* Message STRING (Optional) - Message to display in the notification. Defaults to nil
	* Image STRING (Optional) - Accepts an Image URL to embed into the notification. Defaults to nil
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
	* Custom BOOL (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. Defaults to false.
* SendImage (style,  title,  image,  duration,  sound, custom)
	* Style STRING (Required) - One of the available styles as listed above .
	* Title STRING (Optional) - Title to display in the notification. Defaults to nil
	* Image STRING (Required) - Accepts an Image URL to embed into the notification
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
	* Custom BOOL (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. Defaults to false.

## Supported Markdown Formatting



SimpleNotifications allows for *Markdown-like* tags to be used within the `title` or the `message` parameters, allowing for easy text styling. Many of these tags can be nested to combine Markdown effects.

| Name | Description |
|---|---|
| Inline code | \`\`code\`\` |
| Header (h1) | ``# Header 1\n`` |
| Header (h2) | ``## Header 2\n`` |
| Link | ``{{title\|http://www.example.org/}}`` or ``{{http://www.example.org/}}`` without title. |
| Image | ``![title\|http://www.example.org/image.jpg]`` or ``![http://www.example.org/image.jpg]`` without title. |
| Bold | ``**http://www.example.org/**`` |
| Italic | ``*http://www.example.org/*`` |
| Separator | ``\n---\n`` |
| Float right | ``>*>Text<`` |

**Example Code (Lua)**

Here's an example on how to use Markdown text in a notification called from the **server**

``` lua
local player = 'ServerID of receiving client'
TriggerClientEvent('tnotify:client:SendAny', player, {
	style  =  'success',
	duration  =  10500,
	title  =  'Markdown Formatting Example',
	message  =  '``Code``\n **Bolded Text** \n *Italics Yo* \n # Header 1\n ## Header 2\n',
	sound  =  true
})
```

*This code produces the following notification*

![Markdown Example](https://tasoagc.dev/u/RyYTAX.png)

## Future Features


This resource may develop to adopt the following features:
 - Notification history
 - Toggleable focus state

## License


    MIT License
    
    Copyright (c) 2020 Taso
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
