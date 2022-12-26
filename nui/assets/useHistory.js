/**
 * @typedef {NotiObject} HistoryObject
 * @property {string} id - Persistent Notification ID
 * @property {HTMLDivElement} el - Notification Element
 *
 */

/**
 * @type {string[]}
 */
const SEARCH_TYPES = [
    'title',
    'message',
    'style',
    'date'
]

class UseHistory {
  /**
   * Setup notification history
   * @param {string} position - The position of the history
   * @param {boolean} useHistory - Use history UI
   */
  constructor(position, useHistory = true) {
    this.history = [];
    this.useHistory = useHistory;
    this.count = 0;
    if (!this.useHistory) {
      return;
    }
    this.activeFilter = null;
    this.filter = '';
    this.maxNotis = 4;
    this.currentPage = 0;
    this.paginationEl = document.getElementById('history-pagination');
    this.containerEl = document.getElementById('notification-history');
    this.historyEl = document.querySelector('.history-container');
    this.searchEl = document.querySelector('.history-search');
    this.position = position;
    this.init();
  }

  /**
   * Initialize the history content
   * by adding button listeners and
   * adding proper pagination
   */
  init() {
    this.paginationEl.textContent = '1 / 1';
    const leftBtn = document.getElementById('history-left');
    const rightBtn = document.getElementById('history-right');
    const searchBtn = document.getElementById('history-search');
    const searchInput = document.getElementById('history-search-input');
    document.querySelector('.history-wrapper').classList.add(`gn-${this.position}`);

    leftBtn.addEventListener('click', () => {
      const oldPage = this.currentPage;
      this.currentPage--;
      const useLength = this.activeFilter?.length ?? this.history.length;
      const maxPages = Math.ceil(useLength / this.maxNotis);
      if (this.currentPage < 0) {
        this.currentPage = maxPages - 1;
      }

      if (oldPage !== this.currentPage) {
        this.updateHistory(this.activeFilter ?? this.history);
      }
    });

    rightBtn.addEventListener('click', () => {
      const oldPage = this.currentPage;
      this.currentPage++;
      const useLength = this.activeFilter?.length ?? this.history.length;
      const maxPages = Math.ceil(useLength / this.maxNotis);
      if (this.currentPage >= maxPages) {
        this.currentPage = 0;
      }

      if (oldPage !== this.currentPage) {
        this.updateHistory(this.activeFilter ?? this.history);
      }
    });

    searchBtn.addEventListener('click', () => {
      this.searchHistory(searchInput.value);
      this.filter = searchInput.value;
    });

    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.searchHistory(searchInput.value);
        this.filter = searchInput.value;
      }
    });

    this.showInfo();
  }

  /**
   * Add a notification to the history
   * @param {Object} noti - The notification object
   * @param {string} noti.title - The notification title
   * @param {string} noti.message - The notification message
   * @param {string} noti.style - The notification style
   * @param {string} noti.icon - The notification icon
   */
  addNotification(noti) {
    this.count++;
    const dateText = new Date().toLocaleTimeString();
    if (!this.useHistory) {
      this.history.push({
        id: `notification-${this.count}`,
        date: dateText,
        ...noti,
      });
      return;
    }

    const { title, message, style, icon } = noti;
    const container = document.createElement('div');
    const footer = document.createElement('div');
    const titleEl = document.createElement('h2');
    const messageEl = document.createElement('p');
    const iconEl = this.createIcon(icon);
    const time = document.createElement('span');
    const deleteBtn = document.createElement('button');
    const date = new Date().toLocaleTimeString();

    container.id = `notification-${this.count}`;
    container.classList.add(`gn-${style || 'info'}`);
    titleEl.textContent = title && title.length > 30 ? `${title.substring(0, 32)}...` : title || 'No title was provided';
    message !== undefined ? this.getStringNode(message, messageEl) : messageEl.textContent = 'No message was provided';
    deleteBtn.textContent = 'Delete';

    container.classList.add('history-notification');
    time.textContent = dateText;

    iconEl !== null && titleEl.prepend(iconEl);
    footer.appendChild(time);
    footer.appendChild(deleteBtn);
    container.append(titleEl, messageEl, footer);

    if (this.containerEl.children.length < this.maxNotis) {
      if (this.activeFilter) {
        // Append to container if the notification matches the filter
        if (this.filter) {
          if (this.filterNotification(this.filter, noti)) {
            this.containerEl.appendChild(container);
          }
        }
      } else {
        this.containerEl.appendChild(container);
      }
    }

    if (this.activeFilter) {
      this.activeFilter.push({
        id: container.id,
        el: container,
        date: date,
        ...noti,
      });
    }

    this.history.push({
      id: container.id,
      el: container,
      date: date,
      ...noti,
    });

    this.hideInfo();
    this.updatePagination(this.activeFilter ?? this.history);

    deleteBtn.addEventListener('click', (e) => {
      this.removeNotification(e.target);
    })
  }

  /**
   * Remove a notification from the history
   * by its target delete button element
   * @param {HTMLButtonElement} target
   */
  removeNotification(target) {
    if (!this.useHistory) return;

    const parent = target.parentNode.parentNode;
    const idx = this.history.findIndex((noti) => noti.id === parent.id);
    this.history.splice(idx, 1);
    this.activeFilter?.splice(idx, 1);
    this.containerEl.removeChild(parent);
    this.showInfo();
    this.updatePagination(this.activeFilter ?? this.history);

    // If the last notification is deleted on the current page, go to the previous page
    const useLength = this.activeFilter?.length ?? this.history.length;
    const maxPages = Math.ceil(useLength / this.maxNotis);
    if (useLength > 0 && useLength % this.maxNotis === 0 && this.currentPage >= maxPages) {
      this.currentPage--;
      this.updateHistory(this.activeFilter ?? this.history);
    } else {
      this.updatePage(this.activeFilter ?? this.history);
    }
  }

  /**
   * Removes a notification by its id
   * from the history only
   * @param {string} id
   */
  removeNotificationById(id) {
    const notiId = `notification-${id}`;
    const idx = this.history.findIndex((noti) => noti.id === notiId);
    this.history.splice(idx, 1);
  }

  /**
   * Creates an icon element from a string
   * @param {string} icon - Font Awesome icon name
   * @returns {HTMLElement|null}
   */
  createIcon(icon) {
    if (!icon) return null;
    const iconEl = document.createElement('i');
    const classes = icon.split(' ');

    if (classes.length > 1) {
      iconEl.classList.add(...classes);
    }
    iconEl.classList.add('gn-title-icon');
    return iconEl;
  }

  /**
   * Update the pagination text
   * based on the current page
   * and the total number of pages
   */
  updatePagination(history = this.history) {
    if (!this.useHistory) return;

    if (history.length > 0) {
      const maxPages = Math.ceil(history.length / this.maxNotis);
      this.paginationEl.textContent = `${this.currentPage + 1} / ${maxPages}`;
    }
  }

  /**
   * Handles the update of the history
   * when a notification is deleted
   */
  updatePage(history = this.history) {
    if (!this.useHistory) return;

    if (history.length > this.maxNotis) {
      const maxPages = Math.ceil(history / this.maxNotis);
      if (this.currentPage >= maxPages) {
        this.currentPage = maxPages - 1;
      }
      this.updateHistory(history);
    }
  }

  /**
   * Update the actual history content
   */
  updateHistory(history = this.history) {
    if (!this.useHistory) return;

    this.containerEl.innerHTML = '';
    const start = this.currentPage * this.maxNotis;
    const end = start + this.maxNotis;
    const newHistory = history.slice(start, end);
    newHistory.forEach((noti) => {
      this.containerEl.appendChild(noti.el);
    });

    this.updatePagination(history);
    this.showInfo();
  }

  getStringNode(str, node) {
    const keys = Object.keys(SimpleNotification.tags);
    str = str.length > 85 ? str.substring(0, 85) + '...' : str;
    const finalNodes = [];
    for (let i = 0; i < keys.length; i++) {
      const { type, class: className, open, close } = SimpleNotification.tags[keys[i]];
      // Loop through the string and find all the tags
      let openIdx = 0;
      let closeIdx = 0;
      let pastIdx = 0;
      let tempStr = str;
      while (tempStr.includes(open) && tempStr.includes(close)) {
        let tempText = '';
        openIdx = tempStr.indexOf(open, pastIdx);
        closeIdx = tempStr.indexOf(close, openIdx + 1);
        if (openIdx === -1 || closeIdx === -1) break;
        tempText = tempStr.substring(openIdx + open.length, closeIdx);

        // Add the text before the tag
        if (openIdx > 0) {
          const newNode = document.createElement(type);
          newNode.classList.add(className);
          newNode.textContent = tempText;
          finalNodes.push({
            nodeEl: newNode,
            openIdx: openIdx,
            closeIdx: closeIdx + close.length - 1,
          });
        }
        pastIdx = closeIdx + close.length;
      }
    }

    if (finalNodes.length > 0) {
      finalNodes.sort((a, b) => a.openIdx - b.openIdx);
      let currentIdx = 0;
      let currentStrIdx = 0;
      let hasTextLeft = true;
      while (hasTextLeft) {
        const { nodeEl, openIdx, closeIdx } = finalNodes[currentIdx];
        const beforeNodeText = document.createTextNode(str.substring(currentStrIdx, openIdx));
        node.appendChild(beforeNodeText);
        node.appendChild(nodeEl);
        currentStrIdx = closeIdx + 1;
        currentIdx++;
        if (currentIdx >= finalNodes.length) {
          hasTextLeft = false;
          const afterNodeText = document.createTextNode(str.substring(currentStrIdx));
          node.appendChild(afterNodeText);
        }
      }
    } else {
      node.textContent = str;
    }
  }

  /**
   * Filters through the history based on a filter
   * and updates the history content
   * @param {string} searchVal
   */
  searchHistory(searchVal) {
    if (!this.useHistory) return;

    if (searchVal === '') {
      this.activeFilter = null;
      this.updateHistory();
      return;
    }

    let tempHistory;
    let hasType = '';
    for (const type of SEARCH_TYPES) {
      if (searchVal.includes(`${type}:`)) {
        hasType = type;
        break;
      }
    }

    if (hasType !== '') {
      tempHistory = this.history.filter((noti) => {
        return noti[hasType] && noti[hasType].toLowerCase().includes(searchVal.replace(`${hasType}:`, '').toLowerCase());
      });
    } else {
      tempHistory = this.history.filter((noti) => noti.title && noti.title.includes(searchVal) || noti.message && noti.message.includes(searchVal));
    }

    this.currentPage = 0;
    this.activeFilter = tempHistory
    this.updateHistory(tempHistory);
  }

  /**
   * Remove the info element from the DOM
   */
  hideInfo() {
    if (!this.useHistory) return;

    if (this.history.length > 0) {
      const infoEl = document.querySelector('.history-empty');
      if (infoEl) {
        this.containerEl.removeChild(infoEl);
      }
    }
  }

  /**
   * Creates an info element and adds it to the DOM
   */
  showInfo() {
    if (!this.useHistory) return;

    if (this.containerEl.children.length === 0) {
      const infoEl = document.createElement('p');
      infoEl.textContent = 'No notifications';
      infoEl.classList.add('history-empty');
      this.containerEl.appendChild(infoEl);
    }
  }

  /**
   * Set the visibility of the history
   * @param {boolean} show - true to show, false to hide
   */
  setHistoryVisibility(show) {
    if (!this.useHistory) return;

    const useAnim = show ? ['gn-showing', 'gn-hidden'] : ['gn-hidden', 'gn-showing'];

    if (show) {
      this.historyEl.style.display = 'flex';
      this.searchEl.style.display = 'flex';
    }

    if (this.historyEl.classList.contains(useAnim[1])) {
      this.historyEl.classList.remove(useAnim[1]);
      this.searchEl.classList.remove(useAnim[1]);
    }

    this.historyEl.classList.add(useAnim[0]);
    this.searchEl.classList.add(useAnim[0]);

    setTimeout(() => {
      if (show) {
        this.historyEl.classList.remove(useAnim[0]);
        this.searchEl.classList.remove(useAnim[0]);
      } else {
        this.historyEl.style.display = 'none';
        this.searchEl.style.display = 'none';
      }
    }, 500);
  }

  /**
   * Checks if the new notification has
   * the properties to pass the filter
   * @param {string} filter - The filter to check
   * @param {object} noti - Notification object
   * @returns {*|boolean|boolean}
   */
  filterNotification(filter, noti) {
    if (filter === '') return true;

    let hasType = '';
    for (const type of SEARCH_TYPES) {
      if (filter.includes(`${type}:`)) {
        hasType = type;
        break;
      }
    }

    if (hasType !== '') {
      return noti[hasType] && noti[hasType].toLowerCase().includes(filter.replace(`${hasType}:`, '').toLowerCase());
    } else {
      return noti.title && noti.title.includes(filter) || noti.message && noti.message.includes(filter);
    }
  }

  /**
   * Returns the current noti history
   * @returns {Object[]}
   */
  getHistory() {
    // Return the history without the DOM elements
    return this.history.map((noti) => {
      const { el, ...rest } = noti;
      return rest;
    });
  }

  /**
   * Clears the noti history
   */
  clearHistory() {
    this.history = [];
  }
}

export default UseHistory;