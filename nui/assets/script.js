// Global default variables
import UseHistory from "./useHistory.js";
import {isBrowserEnv} from "./utils.js";
import {registerWindowDebug} from "./test.js";

let insertAnim;
let insertDuration;
let removeAnim;
let removeDuration;
let position;
let maxNotifications;
let notiHistory;

// This is where we store persistent noti's
const persistentNotis = new Map();
const RESOURCE_NAME = !isBrowserEnv() ? window.GetParentResourceName() : 't-notify'

/**
 * @typedef NotiObject
 * @type {object}
 * @property {string} type - Type of notification
 * @property {string} style - Style of notification
 * @property {string} message - Message
 * @property {string} title - Title of message
 * @property {string} image - Image URL
 * @property {string} icon - FontAwesome Icon Class
 * @property {boolean} custom - Custom style
 * @property {string} position - Position
 * @property {number} duration - Time in ms
 */

window.addEventListener("message", (event) => {
  switch (event.data.type) {
    case "init":
      return initFunction(event.data);
    case "persistNoti":
      return playPersistentNoti(event.data);
    case "noti":
      return playNotification(event.data)
    case "history":
      return notiHistory.setHistoryVisibility(event.data.visible);
    case "getHistory":
      return fetch(`https://${RESOURCE_NAME}/getHistory`, {
        method: "POST",
        body: JSON.stringify(notiHistory.getHistory()),
      });
    case "clearHistory":
      return notiHistory.clearHistory();
    case "removeHistoryNoti":
      return notiHistory.removeNotificationById(event.data.id);
  }
});

window.addEventListener("load", () => {
  if (isBrowserEnv()) return;
  fetch(`https://${RESOURCE_NAME}/nuiReady`, {
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
 * @property {boolean} useHistory - Whether to use notification history
 * @property {string} historyPosition - Position for notification history
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

  // Initialize notification history
  if (data.useHistory) {
    notiHistory = new UseHistory(data.historyPosition);
    window.addEventListener("keyup", keyHandler);
  } else {
    notiHistory = new UseHistory(data.historyPosition, false);
    document.querySelector('.history-wrapper').remove();
  }
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
  closeOnClick: false,
  closeButton: false
});

/**
 * Save a notification to history
 * @param noti {NotiObject}- Notification Object
 */
function saveToHistory (noti) {
  if (notiHistory) notiHistory.addNotification(noti);
}

function keyHandler(e) {
  if (e.key === "Escape") {
    fetch(`https://${RESOURCE_NAME}/historyClose`).then((resp) => {
      if (resp) {
        notiHistory.setHistoryVisibility(false);
      }
    }).catch((e) => console.error("Unable to close history", e));
  }
}

//Notification Function
/**
 * Play a regular notification
 * @param noti {NotiObject} - Notification
 */
export function playNotification(noti) {
  // Sanity check
  if (noti) {
    const options = createOptions(noti);

    const content = {
      title: noti.title && noti.title.toString(),
      image: noti.image,
      icon: noti.icon,
      text: noti.message && noti.message.toString(),
    };

    if (noti.custom) {
      const customClass = "gn-" + noti.style;
      SimpleNotification.custom([customClass], content, options);
      return;
    }


    SimpleNotification[noti.style.toLowerCase()](content, options);
    saveToHistory(noti);
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
    icon: noti.icon,
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
    saveToHistory(noti);
    return;
  }

  persistentNotis.set(
    id,
    SimpleNotification[noti.style.toLowerCase()](content, persistOptions)
  );
  saveToHistory(noti);
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

  if (noti.icon) {
    persistentNoti.setIcon(noti.icon)
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

// Lets register our debug methods for browser
if (isBrowserEnv()) {
  registerWindowDebug();
  notiHistory.setHistoryVisibility(true);
}
