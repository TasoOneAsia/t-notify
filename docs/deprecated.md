
### Server and Client Triggers (deprecated)

>Under T-Notify v1.3.0, notifications were triggered using these methods. The current method uses an **Object** rather than regular parameters.

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