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
   */
  constructor(position) {
    this.history = [];
    this.maxNotis = 4;
    this.currentPage = 0;
    this.count = 0;
    this.paginationEl = document.getElementById('history-pagination');
    this.containerEl = document.getElementById('notification-history');
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
   */
  addNotification(noti) {
    const { title, message, style } = noti;
    const container = document.createElement('div');
    const footer = document.createElement('div');
    const titleEl = document.createElement('h2');
    const messageEl = document.createElement('p');
    const time = document.createElement('span');
    const deleteBtn = document.createElement('button');
    const date = new Date().toLocaleTimeString();

    this.count++;
    container.id = `notification-${this.count}`;
    container.classList.add(`gn-${style || 'info'}`);
    titleEl.textContent = title && title.length > 32 ? `${title.substring(0, 32)}...` : title || 'No title was provided';
    messageEl.textContent = message && message.length > 82 ? `${message.substring(0, 82)} ...` : message || 'No message was provided';
    deleteBtn.textContent = 'Delete';

    container.classList.add('history-notification');
    time.textContent = new Date().toLocaleTimeString();
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

  /**
   * Update the pagination text
   * based on the current page
   * and the total number of pages
   */
  updatePagination() {
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
    if (searchVal === '') {
      this.updateHistory();
      return;
    }

    let tempHistory = [];
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
    const historyEl = document.querySelector('.history-container');
    const searchEl = document.querySelector('.history-search');

    const useAnim = show ? ['gn-showing', 'gn-hidden'] : ['gn-hidden', 'gn-showing'];

    if (show) {
      historyEl.style.display = 'flex';
      searchEl.style.display = 'flex';
    }

    if (historyEl.classList.contains(useAnim[1])) {
      historyEl.classList.remove(useAnim[1]);
      searchEl.classList.remove(useAnim[1]);
    }

    historyEl.classList.add(useAnim[0]);
    searchEl.classList.add(useAnim[0]);

    setTimeout(() => {
      if (show) {
        historyEl.classList.remove(useAnim[0]);
        searchEl.classList.remove(useAnim[0]);
      } else {
        historyEl.style.display = 'none';
        searchEl.style.display = 'none';
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
   * Clears the noti history
   */
  clearHistory() {
    this.history = [];
  }

  /**
   * Creates notifications to test the history
   * @param {number} count - The number of notifications to create
   */
  debug(count) {
    for (let i = 0; i < count; i++) {
      this.addNotification({
        title: `Notification ${i}`,
        message: 'Notification message',
        style: 'success',
      });
    }
  }
}

export default UseHistory;