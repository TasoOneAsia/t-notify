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
      this.currentPage--;
      const maxPages = Math.ceil(this.history.length / this.maxNotis);
      if (this.currentPage < 0) {
        this.currentPage = maxPages - 1;
      }
      this.updateHistory();
    });

    rightBtn.addEventListener('click', () => {
      this.currentPage++;
      const maxPages = Math.ceil(this.history.length / this.maxNotis);
      if (this.currentPage >= maxPages) {
        this.currentPage = 0;
      }
      this.updateHistory();
    });

    searchBtn.addEventListener('click', () => {
      this.searchHistory(searchInput.value);
    });

    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.searchHistory(searchInput.value);
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
    messageEl.textContent = message && message.length > 82 ? `${message.substring(0, 82)} ...` : message || 'No message was provided';
    deleteBtn.textContent = 'Delete';

    container.classList.add('history-notification');
    time.textContent = dateText;

    iconEl !== null && titleEl.prepend(iconEl);
    footer.appendChild(time);
    footer.appendChild(deleteBtn);
    container.append(titleEl, messageEl, footer);

    if (this.history.length < this.maxNotis) {
      this.containerEl.appendChild(container);
    }

    this.history.push({
      id: container.id,
      el: container,
      date: date,
      ...noti,
    });
    this.hideInfo();
    this.updatePagination();

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
    this.containerEl.removeChild(parent);
    this.showInfo();
    this.updatePagination();

    // If the last notification is deleted on the current page, go to the previous page
    const maxPages = Math.ceil(this.history.length / this.maxNotis);
    if (this.history.length > 0 && this.history.length % this.maxNotis === 0 && this.currentPage >= maxPages) {
      this.currentPage--;
      this.updateHistory();
    } else {
      this.updatePage();
    }
  }

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
  updatePagination() {
    if (!this.useHistory) return;

    if (this.history.length > 0) {
      const maxPages = Math.ceil(this.history.length / this.maxNotis);
      this.paginationEl.textContent = `${this.currentPage + 1} / ${maxPages}`;
    }
  }

  /**
   * Handles the update of the history
   * when a notification is deleted
   */
  updatePage() {
    if (!this.useHistory) return;

    if (this.history.length > this.maxNotis) {
      const maxPages = Math.ceil(this.history.length / this.maxNotis);
      if (this.currentPage >= maxPages) {
        this.currentPage = maxPages - 1;
      }
      this.updateHistory();
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

    this.updatePagination();
    this.showInfo();
  }

  searchHistory(searchVal) {
    if (!this.useHistory) return;

    if (searchVal === '') {
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
   * Clears the noti history
   */
  clearHistory() {
    this.history = [];
  }
}

export default UseHistory;