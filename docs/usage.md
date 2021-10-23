# Base Styling

*These are used when passing the `style` property*

**Default Styles**
* `info`
* `error`
* `warning`
* `success`
* `message`

T-Notify also allows for the addition of custom user-specified classes in the custom.css file that can be used in conjunction with the default styles. 

>By default, there is an example custom notification style included in `/nui/custom.css` that can be used as a reference to build upon. Below you can find a small guide referencing that class.

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

```lua
TriggerClientEvent('t-notify:client:Custom', source, {
    style = 'example',
    duration = 6000,
    title = 'Markdown Formatting Example',
    message = '``Code``\n **Bolded Text** \n *Italics Yo* \n # Header 1\n ## Header 2\n',
    sound = true,
    custom = true
})
```

*This snippet produces the following notification and is triggered server side:*

![Example Styled Notification](https://tasoagc.dev/u/0tiWNE.png)

On the other hand, if we **forget** to set the `custom` property as **True** the following error will be produced:

```javascript
Uncaught TypeError: SimpleNotification[noti.style] is not a function
```

## Function Types

>T-Notify has three main functions which can be used with either an `export` or a `TriggerClientEvent`

**Alert** - *Send an alert styled notification with just a message, no title, no image.*

**Custom** - *Send a custom notification according to any properties chosen by the user.*

**Image** - *Send an image with an optional title.*

**Persistent** - *Send a notification that is persistent*

## Triggering Notifications
> In versions of T-Notify below v1.3.0, Client-Side exports were triggered a little bit differently. See the [deprecated](/deprecated) methods for more details.

You can trigger notifications from both the Client-Side or the Server-Side. The object passed on either side has the exact same properties but an `export` is used on the Client-Side and a `TriggerClientEvent` is used on the Server-Side.

Both of them require you pass an **Object**, here are some examples:

**Client**
```lua
exports['t-notify']:Alert({
	style = 'error', 
	message = 'Example alert from the client side'
})
```
**Server**
```lua
TriggerClientEvent('t-notify:client:Custom', source, {
	style = 'info',
	title = 'Notification Example',
	message = 'Here is the message',
	duration = 5500
})
```
### Object Properties
Depending on the function, the object can have optional and required properties. The properties and their respective functions can be found below.

* **Alert**
  * `style` {STRING} (Required) - One of the available styles as listed in the **[base styling](usage?id=base-styling)** section.
  * `message` {STRING} (Required) - Message to display in the alert.
  * `duration` {NUMBER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
  * `sound` {BOOL or OBJECT} (Optional) - If true, the notification will also have an alert sound. Can also accept an object for custom sound on a per notification basis. *Defaults to false*.
      * `name` {STRING} (Optional) - An audio name like what can be found in `config.lua`
      * `reference` {STRING} (Optional) - An audio reference like what can be found in `config.lua`
  * `custom` {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style. *Defaults to false.*
  * `position` {STRING} (Optional) - Position of the notification to display (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, middle-left, middle-right) *Defaults to config*
* **Custom**
  * `style` {STRING} (Required) - One of the available styles as listed in the **[base styling](usage?id=base-styling)** section.
  * `title` {STRING} (Optional) - Title to display in the notification. *Defaults to nil*
  * `message` {STRING} (Optional) - Message to display in the notification. *Defaults to nil*
  * `image` {STRING} (Optional) - Accepts an Image URL to embed into the notification. *Defaults to nil*
  * `duration` {NUMBER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
  * `sound` {BOOL or OBJECT} (Optional) - If true, the notification will also have an alert sound. Can also accept a table for custom sound on a per notification basis. *Defaults to false*.
      * `name` {STRING} (Optional) - An audio name like what can be found in `config.lua`
      * `reference` {STRING} (Optional) - An audio reference like what can be found in `config.lua`
  * `custom` {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false*.
  * `position` {STRING} (Optional) - Position of the notification to display (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, middle-left, middle-right) *Defaults to config*
* **Image**
  * `style` {STRING} (Required) - One of the available styles as listed in the **[base styling](usage?id=base-styling)** section.
  * `title` {STRING} (Optional) - Title to display in the notification. *Defaults to nil*
  * `image` {STRING} (Required) - Accepts an Image URL to embed into the notification
  * `duration` {NUMBER} (Optional) - Duration to display notification in ms. *Defaults to 2500ms*.
  * `sound` {BOOL or OBJECT} (Optional) - If true, the notification will also have an alert sound. Can also accept an object for custom sound on a per notification basis. *Defaults to false*.
      * `name` {STRING} (Optional) - An audio name like what can be found in `config.lua`
      * `reference` {STRING} (Optional) - An audio reference like what can be found in `config.lua`
  * `custom` {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false*.
  * `position` {STRING} (Optional) - Position of the notification to display (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, middle-left, middle-right) *Defaults to config*
* **Persistent**
  * `step` {STRING} (Required) - The specific step for the persistent notification call (start, update, end).
  * `id` {STRING} (Required) - The unique id for the persistent notification being called. This must be a unique id to each persistent notification.
  * `options` {OBJECT} (Optional) - Contains options for the notification. This object needs to be passed **when** a persistent notification is being called with the `'start'` step.
    * `style` {STRING} (Required) - One of the available styles as listed in the **[base styling](usage?id=base-styling)** section.
    * `title` {STRING} (Optional) - Title to display in the notification. *Defaults to nil*
    * `image` {STRING} (Optional) - Accepts an Image URL to embed into the notification
    * `sound` {BOOL or OBJECT} (Optional) - If true, the notification will also have an alert sound. Can also accept an object for custom sound on a per notification basis. *Defaults to false*.
      * `name` {STRING} (Optional) - An audio name like what can be found in `config.lua`
      * `reference` {STRING} (Optional) - An audio reference like what can be found in `config.lua` 
    * `custom` {BOOL} (Optional) - This ***must*** be set to true in order to utilize a custom style that wasn't present by default. *Defaults to false*.
    * `position` {STRING} (Optional) - Position of the notification to display (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, middle-left, middle-right) *Defaults to config value*

### Examples

Here are some example triggers for each of main functions.

**Custom**
```lua
-- Server-side
TriggerClientEvent('t-notify:client:Custom', ServerID, {
	style  =  'success',
	duration  =  10500,
	title  =  'Markdown Formatting Example',
	message  =  '``Code``\n **Bolded Text** \n *Italics Yo* \n # Header 1\n ## Header 2\n',
	sound  =  true
})

-- Client-side
exports['t-notify']:Custom({
	style  =  'success',
	duration  =  10500,
	title  =  'Markdown Formatting Example',
	message  =  '``Code``\n **Bolded Text** \n *Italics Yo* \n # Header 1\n ## Header 2\n',
	sound  =  true
})
```
This code snippet produced the following notification:

![Custom Example](https://tasoagc.dev/u/RyYTAX.png)

**Alert**
```lua
-- Server-side
TriggerClientEvent('t-notify:client:Alert', ServerID, {
	style  =  'error',
	message  =  '✔️ This is a success alert'
})

-- Client-side
exports['t-notify']:Alert({
	style  =  'success',
	message  =  '✔️ This is a success alert'
})
```

This code snippet produced the following notification:

![Alert Example](https://tasoagc.dev/u/WVzheO.png)

**Image**
```lua
-- Server-side
TriggerClientEvent('t-notify:client:Image', ServerID, {
	style = 'info',
	duration = 11500,
	title = 'Notification with an Image',
	image = 'https://tasoagc.dev/u/61Gg0W.png',
	sound = true
})

-- Client-side
exports['t-notify']:Image({
	style = 'info',
	duration = 11500,
	title = 'Notification with an Image',
	image = 'https://tasoagc.dev/u/61Gg0W.png',
	sound = true
})
```
This code snippet produced the following notification:

![Image Example](https://tasoagc.dev/u/wmcisu.png)

**Persistent**

*Starting a Persistent Notification:*

```lua
-- Server-side
TriggerClientEvent('t-notify:client:Persist', ServerID, {
	id = 'uniquePersistId',
	step = 'start',
	options = {
		style = 'info',
		title = 'Notification with an Image',
		image = 'https://tasoagc.dev/u/61Gg0W.png',
		sound = true
	}
})

-- Client-side
exports['t-notify']:Persist({
	id = 'uniquePersistId',
	step = 'start',
	options = {
		style = 'info',
		title = 'Notification with an Image',
		image = 'https://tasoagc.dev/u/61Gg0W.png',
		sound = true
	}
})
```

*Updating a Persistent Notification:*

```lua
-- Server-side
TriggerClientEvent('t-notify:client:Persist', ServerID, {
	id = 'uniquePersistId',
	step = 'update',
	options = {
		style = 'info',
		title = 'Notification with an Image',
		image = 'https://tasoagc.dev/u/61Gg0W.png',
		message = 'This is a message'
	}
})

-- Client-side
exports['t-notify']:Persist({
	id = 'uniquePersistId',
	step = 'update',
	options = {
		style = 'info',
		title = 'Notification with an Image',
		image = 'https://tasoagc.dev/u/61Gg0W.png',
		message = 'This is a message'
	}
})
```

*Ending a Persistent Notification:*
```lua
-- Server-side
TriggerClientEvent('t-notify:client:Persist', ServerID, {
	id = 'uniquePersistId',
	step = 'end'
})

-- Client-side
exports['t-notify']:Persist({
	id = 'uniquePersistId',
	step = 'end'
})
```

## Markdown Formatting Tags

>Notifications allows for *Markdown-like* tags to be used within the `message` property, allowing for easy text styling. Many of these tags can be nested to combine Markdown effects.

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
| Float right | ``>>Text<`` |

**Example Code**

Here's an example on how to use Markdown text in a notification called from the **server**

``` lua
TriggerClientEvent('t-notify:client:Custom', ServerID, {
	style  =  'success',
	duration  =  10500,
	title  =  'Markdown Formatting Example',
	message  =  '``Code``\n **Bolded Text** \n *Italics Yo* \n # Header 1\n ## Header 2\n',
	sound  =  true
})
```

This code snippet produced the following notification:

![Markdown Example](https://tasoagc.dev/u/RyYTAX.png)

## Color Formatting

>With v1.4.0, there was a new addition to t-notify. With this new update, you are now capable of using colors you notification. You can begin using them by adding ~~ before and after your displayed message.

| Code | Colors |
|---|---|
| r | Red |
| g | Green |
| y | Yellow |
| b | Blue | 
| c | Cyan | 
| p | Purple |
| w | White |
| o | Orange |
| gy | Gray |

**Example Code**

Here's an example on how to use colored text in a notification called from the **client**

``` lua
exports['t-notify']:Custom({
    style  =  'message',
    duration  =  11000,
    title  =  'Colors Example',
    message  =  '~r~Red~r~ \n ~g~Green~g~ \n ~y~Yellow~y~ \n ~b~Blue~b~ \n ~c~Cyan~c~ \n ~p~Purple~p~ \n ~w~White~w~ \n ~o~Orange~o~ \n ~gy~Grey~gy~ \n',
    sound  =  true
})
```

This code snippet produced the following notification:

![Colors Example](https://camo.githubusercontent.com/f03940f6150420145ef63d5b82a6eaa0ec7ed65f0407c126088cb6f207be0b09/68747470733a2f2f692e7461736f6167632e6465762f42786b77)
