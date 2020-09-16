$(document).ready(() => {
    window.addEventListener('message', function (event) {
        playNotification(event.data)
    })
})

//Notification Function
function playNotification (noti) {
    if (noti) {
        let options = {
            duration: noti.time,
            position: noti.position,
            insertAnimation: {
                name: "insert-right",
                duration: 1000
            },
            removeAnimation: {
                name: "fadeout",
                duration: 450
            }
        };
        SimpleNotification[noti.style]({
            title: noti.title,
            image: noti.image,
            text: noti.message
        }, options);
    }
}