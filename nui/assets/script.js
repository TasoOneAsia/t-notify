// Global default variables
let insertAnim;
let insertDuration;
let removeAnim;
let removeDuration;
let position;
let maxNotifications;

// This is where we store persistent noti's
const persistentNotis = new Map();

/**
 * @typedef NotiObject
 * @type {object}
 * @property {string} type - Type of notification
 * @property {string} style - Style of notification
 * @property {string} message - Message
 * @property {string} title - Title of message
 * @property {string} image - Image URL
 * @property {boolean} custom - Custom style
 * @property {string} position - Position
 * @property {number} duration - Time in ms
 */

window.addEventListener("message", (event) => {
  switch (event.data.type) {
    case "init":
      initFunction(event.data);
      break;
    case "persistNoti":
      playPersistentNoti(event.data);
      break;
    default:
      playNotification(event.data);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://t-notify/nuiReady", {
    method: "POST",
  }).catch((e) => console.error("Unable to send NUI ready message", e));
});

/**
 * @typedef InitData
 * @type {object}
 * @property {string} position - Position for notification
 * @property {string} insertAnim - Which insert animation to use
 * @property {number} insertDuration - Insert duration to use
 * @property {string} removeAnim - Which remove animation to use
 * @property {number} removeDuration - Remove duration to use
 * @property {number} maxNotifications - Max number of notifications to use
 */

/**
 * Initialize default global variables
 * @param data {InitData}
 */
function initFunction(data) {
  position = data.position;
  insertAnim = data.insertAnim;
  insertDuration = data.insertDuration;
  removeAnim = data.removeAnim;
  removeDuration = data.removeDuration;
  maxNotifications = data.maxNotifications;
}

/**
 * Initialize default global variables
 * @param noti {NotiObject}
 */

const createOptions = (noti) => ({
  // Unfortunately cannot use optional chaining as I think NUI is ES6
  duration: noti.duration || undefined,
  position: noti.position || position,
  maxNotifications: maxNotifications,
  insertAnimation: {
    name: insertAnim,
    duration: insertDuration,
  },
  removeAnimation: {
    name: removeAnim,
    duration: removeDuration,
  },
});

//Notification Function
/**
 * Play a regular notification
 * @param noti {NotiObject} - Notification
 */
function playNotification(noti) {
  // Sanity check
  if (noti) {
    const options = createOptions(noti);

    const content = {
      title: noti.title && noti.title.toString(),
      image: noti.image,
      text: noti.message && noti.message.toString(),
    };

    if (noti.custom) {
      const customClass = "gn-" + noti.style;
      SimpleNotification.custom([customClass], content, options);
      return;
    }

    SimpleNotification[noti.style.toLowerCase()](content, options);
  }
}

/**
 *
 * @param id {string} - Notification ID
 * @param noti {NotiObject}- Notification Object
 * @returns {void}
 */
const startPersistentNoti = (id, noti) => {
  if (persistentNotis.has(id))
    return console.log(
      `Persistent Notification with that ID already exists (${id})`
    );

  // Base options
  const options = createOptions(noti);

  // Add sticky property
  const persistOptions = { ...options, sticky: true };

  // Create content object
  const content = {
    title: noti.title,
    image: noti.image,
    text: noti.message,
  };

  // Handle custom styling
  if (noti.custom) {
    // Auto prepend gn class
    const customClass = "gn-" + noti.style;

    persistentNotis.set(
      id,
      SimpleNotification.custom([customClass], content, persistOptions)
    );
    return;
  }

  persistentNotis.set(
    id,
    SimpleNotification[noti.style.toLowerCase()](content, persistOptions)
  );
};

/**
 * End a persistent notification
 * @param id {string} - Persistent Notification ID
 * @returns {void}
 */
const endPersistentNoti = (id) => {
  if (!persistentNotis.has(id)) {
    console.error(
      "Persistent Notification ID not found in cache. First start a persistent notification before ending."
    );
    return;
  }
  const noti = persistentNotis.get(id);
  noti.closeAnimated();
  persistentNotis.delete(id);
};

/**
 * Update a persistent notification
 * @param id {string} - Persistent Notification ID
 * @param noti {NotiObject}- Notification Object
 * @returns {void}
 */
const updatePersistentNoti = (id, noti) => {
  if (!persistentNotis.has(id)) {
    console.error(
      "Persistent Notification ID not found in cache. First start a persistent notification before updating."
    );
    return;
  }

  const persistentNoti = persistentNotis.get(id);
  if (noti.image) {
    persistentNoti.setImage(noti.image)
  }

  if (noti.message) {
    persistentNoti.setText(noti.message)
  }

  if (noti.title) {
    persistentNoti.setTitle(noti.title)
  }
};

/**
 * @typedef PersistentNoti
 * @type {object}
 * @property {string} type - Type of notification
 * @property {NotiObject} options - Type of notification
 * @property {string} step - Step for persistent noti
 * @property {string | number} id - Unique ID for persistent noti
 */

/**
 * Play a persistent notification
 * @param noti {PersistentNoti} - The persistent notification object
 */
function playPersistentNoti(noti) {
  const id = noti.id.toString();

  switch (noti.step) {
    case "start":
      startPersistentNoti(id, noti.options);
      break;
    case "update":
      updatePersistentNoti(id, noti.options)
      break;
    case "end":
      endPersistentNoti(id);
      break;

    default:
      console.error(
        "Invalid step for persistent notification must be `start`, `end`, or `update`"
      );
  }
}
