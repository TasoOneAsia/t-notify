let insertAnim
let insertDuration
let removeAnim
let removeDuration
let position
let maxNotifications

$(document).ready(() => {
    window.addEventListener('message', function (event) {
        if (event.data.type === 'init') {
            initFunction(event.data)
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
            position: position,
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