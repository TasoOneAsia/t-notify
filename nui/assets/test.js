import { playNotification } from "./script.js";
import { mockNuiMessage } from "./utils.js";

/**
 * Window debug method for browser testing
 * @param notiObject {NotiObject}
 **/
const testNotify = (notiObject) => {
  playNotification({ type: "noti", ...notiObject });
};

// Setup the environment for debugging
export const registerWindowDebug = () => {
  /** @type {InitData} */
  const browserConfig = {
    position: "top-right",
    insertAnim: "insert-right",
    insertDuration: 1000,
    removeAnim: "fadeout",
    removeDuration: 600,
    maxNotifications: 0,
    useHistory: false,
  };

  mockNuiMessage({
    type: "init",
    ...browserConfig,
  });

  window.testNotify = testNotify;

  console.log(
    "%cT-Notify Brower Debug",
    "color: red; font-size: 30px; -webkit-text-stroke: 1px black; font-weight: bold;"
  );

  const helpText = `%cWelcome to T-Notify's browser debugging tool. When running t-notify in browser, certain developer tools are automatically enabled.\n\n\`window.testNotify\` has been registered as a function. It accepts a object of type NotiObject.\n\ninterface NotiObject ${JSON.stringify({type: 'string', style: 'info | error | success', message: 'string', title: 'string', image: 'string', custom: 'boolean', position: 'top-right | top-left | bottom-left | bottom-right', duration: 'number'}, null, '\t')}`;
  console.log(helpText, "color: green; font-size: 15px");

  const browserConfText = "%cWhen in browser, this is the default config:";

  console.log(
    browserConfText,
    "color: green; font-size: 15px; font-weight: bold;"
  );
  console.log(
    "%c" + JSON.stringify(browserConfig, null, "\t"),
    "font-size: 15px; color: green;"
  );

  const exampleText = `%cHeres a simple example:\n\nwindow.testNotify({ style: 'info', message: 'test'})`;
  console.log(exampleText, "color: green; font-size: 15px; font-weight: bold;");

  playNotification({
    position: "top-right",
    type: "noti",
    style: "info",
    duration: 15000,
    title: 'Browser Debug',
    message:
      "Welcome to T-Notify in the browser, please open DevTools console for further info!",
  });
};
