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
})

function initFunction(data) {
    position = data.position
    insertAnim = data.insertAnim
    insertDuration = data.insertDuration
    removeAnim = data.removeAnim
    removeDuration = data.removeDuration
    maxNotifications = data.maxNotifications
}

//Notification Function
function playNotification (noti) {
    if (noti) {
        const options = {
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
        };
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

    if (noti.step === 'start') {
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
            let persistent = SimpleNotification[noti.options.style](content, options)
            persistentNotis[id] = persistent
        } else {
            const customClass = 'gn-' + noti.options.style
            let persistent = SimpleNotification.custom(
                [customClass],
                content,
                options
            )
            persistentNotis[id] = persistent
        }
    } else if (noti.step === 'end') {
        if (persistentNotis[id] !== undefined) {
            persistentNotis[id].closeAnimated()
            persistentNotis[id] = undefined
        } else {
            console.log('Persistent Notification ID not found. First start a persistent notification before ending.')
        }
    } else {
        console.log('Unknown step for persistent notification (start, end)')
    }
}