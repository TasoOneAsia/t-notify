# Base Styling

*These are used when passing the `style` property*

**Default Styles**
* Info
* Error
* Warning
* Success

>T-Notify also allows for the addition of custom user-specified classes in the custom.css file that can be used in conjunction with the default styles. By default, there is an example notification style included in the custom.css that can be used as a reference to build upon. Here is a short guide utilizing that example class.

## Custom Classes Guide

	/* This snippet is taken from custom.css, in the 'nui' directory */
	
	/* Always attempt to keep user edited CSS to this file only, unless you know what you are doing  */

	.gn-example {
    	background-color: pink;
    	color: black;
    	text-shadow: 0 1px 1px white;
	}

>This example above shows a custom style that can be invoked whenever a notification is sent. Custom styles **must** have their CSS class **always** prefixed by `gn-` otherwise they will not work correctly. 

### Invoking a Custom Style

In order to use a custom style when invoking a notification, the property ``custom`` ***MUST*** also be set to true. We'll use the example styling for this snippet:

	lua
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

On the other hand, if we **forget** to set the `custom` property as **True** the following error will be produced:

```javascript
Uncaught TypeError: SimpleNotification[noti.style] is not a function
```

## Function Definitions

> Notifications in T-Notify can either be triggered from the *client* or from the *server*. Take a look at what each function does below!

**SendTextAlert** - *Send an alert styled notification with just a message, no title, no image.*

**SendAny** - *Send a custom notification according to any properties chosen by the user.*

**SendImage** - *Send an image with an optional title.*

### Server and Client Triggers

### Exports (Client-Side)

* SendTextAlert (style, message, duration, sound, custom)
	* Style {STRING} (Required) - One of the available styles as listed in the **Styling** Section.
	* Message {STRING} (Required) - Message to display in the notification.
	* Duration {INTEGER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
	* Sound {BOOL} (Optional) - If true, the notification will also have an alert sound. *Defaults to false*.
	* Custom {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false*.

* SendAny (style,  title,  message,  image,  duration, sound, custom)
	* Style {STRING} (Required) - One of the available styles as listed above .
	* Title {STRING} (Optional) - Title to display in the notification. *Defaults to nil*
	* Message {STRING} (Optional) - Message to display in the notification. *Defaults to nil*
	* Image {STRING} (Optional) - Accepts an Image URL to embed into the notification. *Defaults to nil*
	* Duration {INTEGER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
	* Sound {BOOL} (Optional) - If true, the notification will also have an alert sound. *Defaults to false*.
	* Custom {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false*.

* SendImage (style,  title,  image,  duration,  sound, custom)
	* Style {STRING} (Required) - One of the available styles as listed above.
	* Title {STRING} (Optional) - Title to display in the notification. *Defaults to nil*
	* Image {STRING} (Required) - Accepts an Image URL to embed into the notification
	* Duration {INTEGER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
	* Sound {BOOL} (Optional) - If true, the notification will also have an alert sound. *Defaults to false*.
	* Custom {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false*.

#### Export Example (Lua)

Here is an example of how to trigger a notification event using an `export` on the ***client-side***

```lua
-- This sends a notification with the 'info' styling, an example messsage, a duration of 5500ms, and an audio alert

exports['t-notify']:SendTextAlert('info', 'This is an example message', 5500, true)
```

#### Trigger Client Events (Server-Side)

* SendTextAlert ( style, message, duration, sound, custom)
	* Style {STRING} (Required) - One of the available styles as listed in the **Styling** Section.
	* Message {STRING} (Required) - Message to display in the notification.
	* Duration {NUMBER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
	* Sound {BOOL} (Optional) - If true, the notification will also have an alert sound. *Defaults to false*.
	* Custom {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false.*

* SendAny (style,  title,  message,  image,  duration, sound, custom)
	* Style {STRING} (Required) - One of the available styles as listed above .
	* Title {STRING} (Optional) - Title to display in the notification. *Defaults to nil*
	* Message {STRING} (Optional) - Message to display in the notification. *Defaults to nil*
	* Image {STRING} (Optional) - Accepts an Image URL to embed into the notification. *Defaults to nil*
	* Duration {NUMBER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
	* Sound {BOOL} (Optional) - If true, the notification will also have an alert sound. *Defaults to false*.
	* Custom {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false*.

* SendImage (style,  title,  image,  duration,  sound, custom)
	* Style {STRING} (Required) - One of the available styles as listed above .
	* Title {STRING} (Optional) - Title to display in the notification. *Defaults to nil*
	* Image {STRING} (Required) - Accepts an Image URL to embed into the notification
	* Duration {NUMBER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
	* Sound {BOOL} (Optional) - If true, the notification will also have an alert sound. *Defaults to false*.
	* Custom {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false*.

#### TriggerClientEvent Example (Server-Side)

Here is an example on how to trigger a notification using a `TriggerClientEvent` on the ***server-side***

``` lua
local player = 'ServerID of receiving client'

TriggerClientEvent('tnotify:client:SendTextAlert', player, {
	style  =  'error',
	duration  =  10500,
	message  =  'Alert Test',
	sound  =  true
})
```

## Markdown Formatting Tags

>SimpleNotifications allows for *Markdown-like* tags to be used within the `title` or the `message` properties, allowing for easy text styling. Many of these tags can be nested to combine Markdown effects.

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

This code snippet produced the following notification:

![Markdown Example](https://tasoagc.dev/u/RyYTAX.png)