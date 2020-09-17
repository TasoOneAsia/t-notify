
# T-Notify

  

A FiveM implementation of the lightweight [SimpleNotification.js](https://github.com/Glagan/SimpleNotification) library created by [Glagan](https://github.com/Glagan/)


## Features

* Notification queue system

* Notification positioning

* *Markdown-like* formatting

* Sound alerts when notifications are triggered

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
	    position = 'top-right',
	    sound = {
	        name = '5_SEC_WARNING',
	        reference = 'HUD_MINI_GAME_SOUNDSET'
	    }
	}
* **Position** - Will change the positioning of the notifications (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
* **Sound** - Allows for the change of the notification alert sound. Reference [this](https://pastebin.com/DCeRiaLJ) for options.
	* *name* - audioName
	* *reference* - audioRef

## Styles
* Info
* Error
* Warning
* Success

*These are used when passing the `style` parameter*
## Utilization

T-Notify notifications can be triggered from either Client-Side or Server-Side.

  

**How to Use Exported Functions (Client Side)**

To call a notification from the client, insert an export into your code like the example below:

	exports['t-notify']:SendTextAlert('info', 'This is an info message', 5500, true)

**Available Client Exports**
* SendTextAlert | ( style, message, duration, sound )
	* Style STRING (Required) - One of the available styles as listed above.
	* Message STRING (Required) - Message to display in the notification.
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
* SendAny | (style,  title,  message,  image,  duration,  sound)
	* Style STRING (Required) - One of the available styles as listed above .
	* Title STRING (Optional) - Title to display in the notification. Defaults to nil
	* Message STRING (Optional) - Message to display in the notification. Defaults to nil
	* Image STRING (Optional) - Accepts an Image URL to embed into the notification. Defaults to nil
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
* SendImage | (style,  title,  image,  duration,  sound)
	* Style STRING (Required) - One of the available styles as listed above .
	* Title STRING (Optional) - Title to display in the notification. Defaults to nil
	* Image STRING (Required) - Accepts an Image URL to embed into the notification
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.

**How to Use T-Notify Client Events (Server-Side)**

To call a notification from the server-side, insert a TriggerClientEvent into your code like the example below:
	
	TriggerClientEvent('tnotify:client:SendTextAlert', source, {
		style  =  'error',
		duration  =  10500,
		message  =  'Alert Test',
		sound  =  true
	})

*Unlike the export on the client side, the TriggerClientEvent requires that parameters **must** be placed in an object, as shown in the example above*

**Available Client Events (Server-Side)**

* SendTextAlert | ( style, message, duration, sound )
	* Style STRING (Required) - One of the available styles as listed above.
	* Message STRING (Required) - Message to display in the notification.
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
* SendAny | (style,  title,  message,  image,  duration,  sound)
	* Style STRING (Required) - One of the available styles as listed above .
	* Title STRING (Optional) - Title to display in the notification. Defaults to nil
	* Message STRING (Optional) - Message to display in the notification. Defaults to nil
	* Image STRING (Optional) - Accepts an Image URL to embed into the notification. Defaults to nil
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.
* SendImage | (style,  title,  image,  duration,  sound)
	* Style STRING (Required) - One of the available styles as listed above .
	* Title STRING (Optional) - Title to display in the notification. Defaults to nil
	* Image STRING (Required) - Accepts an Image URL to embed into the notification
	* Duration INTEGER (Optional) - Duration to display notification in ms. Defaults to 2500ms.
	* Sound BOOL (Optional) - If true, the notification will also have an alert sound. Defaults to false.

## Supported Markdown Formatting
SimpleNotifications.js allows for *Markdown-like* tags to be used within the `title` or the `message`parameters, allowing for easy text styling. Many of these tags can be nested to combine Markdown effects.

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

	TriggerClientEvent('tnotify:client:SendAny', source, {
		style  =  'success',
		duration  =  10500,
		title  =  'Markdown Formatting Example',
		message  =  '``Code``\n **Bolded Text** \n *Italics Yo* \n # Header 1\n ## Header 2\n',
		sound  =  true
	})

*This code produces the following notification*

![Markdown Example](https://tasoagc.dev/u/RyYTAX.png)

## Possible Future Features

 - Custom Styles
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
