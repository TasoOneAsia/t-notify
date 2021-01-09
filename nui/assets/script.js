let insertAnim
let insertDuration
let removeAnim
let removeDuration
let position
let maxNotifications

let persistentNotis = {}

$(document).ready(() => {
  window.addEventListener('message', function (event) {
    if (event.data.type === 'init') {
      initFunction(event.data)
    } else if (event.data.type === 'persistNoti') {
      playPersistentNoti(event.data)
    } else {
      playNotification(event.data)
    }
  })
  $.post("https://t-notify/nuiReady")
})

function initFunction(data) {
  position = data.position
  insertAnim = data.insertAnim
  insertDuration = data.insertDuration
  removeAnim = data.removeAnim
  removeDuration = data.removeDuration
  maxNotifications = data.maxNotifications
}

function createOptions (noti) {
  return {
    duration: noti.time,
    position: noti.position || position,
    maxNotifications: maxNotifications,
    insertAnimation: {
      name: insertAnim,
      duration: insertDuration
    },
    removeAnimation: {
      name: removeAnim,
      duration: removeDuration
    }
  }
}

//Notification Function
function playNotification (noti) {
  if (noti) {
    const options = createOptions(noti)
    const content = {
      title: noti.title,
      image: noti.image,
      text: noti.message
    }
    if (!noti.custom) {
      SimpleNotification[noti.style](content, options);
    } else {
      const customClass = 'gn-' + noti.style
      SimpleNotification.custom(
        [customClass],
        content,
        options
      )
    }
  }
}

function playPersistentNoti (noti) {
  const id = noti.id.toString()

  if (noti.step !== 'start' && noti.step !== 'end') return console.log('Invalid step for persistent notification must be `start` or `end`')

  if (noti.step === 'start') {
    if (persistentNotis[id]) return console.log(`Persistent Notification with that ID already exists (${noti.id})`)
    const options = {
      position: noti.options.position || position,
      maxNotifications: maxNotifications,
      insertAnimation: {
        name: insertAnim,
        duration: insertDuration
      },
      removeAnimation: {
        name: removeAnim,
        duration: removeDuration
      },
      sticky: true
    };
    const content = {
      title: noti.options.title,
      image: noti.options.image,
      text: noti.options.message
    }

    if (!noti.options.custom) {
      persistentNotis[id] = SimpleNotification[noti.options.style](content, options)
    } else {
      const customClass = 'gn-' + noti.options.style
      persistentNotis[id] = SimpleNotification.custom(
        [customClass],
        content,
        options
      )
    }
  }

  if (noti.step === 'end') {
    if (persistentNotis[id]) {
      persistentNotis[id].closeAnimated()
      delete persistentNotis[id]
    } else {
      console.log('Persistent Notification ID not found in cache. First start a persistent notification before ending.')
    }
  }
}