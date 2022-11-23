class UseHistory {
  history = [];
  count = 0;
  currentPage = 0;
  maxNotis = 4;
  paginationEl = null;
  position = null;
  containerEl = null;
  constructor(position) {
    this.history = [];
    this.position = position;
    this.paginationEl = document.getElementById('history-pagination');
    this.containerEl = document.getElementById('notification-history');
    this.init();
  }

  init() {
    this.paginationEl.textContent = '1 / 1';
    const leftBtn = document.getElementById('history-left');
    const rightBtn = document.getElementById('history-right');

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
      console.log(this.currentPage);
      this.updateHistory();
    });

    this.showInfo();
  }

  addNotification(noti) {
    const { title, message, style } = noti;
    const container = document.createElement('div');
    const footer = document.createElement('div');
    const titleEl = document.createElement('h2');
    const messageEl = document.createElement('p');
    const time = document.createElement('span');
    const deleteBtn = document.createElement('button');

    this.count++;
    container.id = `notification-${this.count}`;
    container.classList.add(`gn-${style || 'info'}`);
    titleEl.textContent = title.length > 32 ? `${title.substring(0, 32)}...` : title;
    messageEl.textContent = message.length > 82 ? `${message.substring(0, 82)} ...` : message;
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
      ...noti,
    });
    this.hideInfo();
    this.updatePagination();

    deleteBtn.addEventListener('click', (e) => {
      this.removeNotification(e.target);
    })
  }

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

  updatePagination() {
    if (this.history.length > 0) {
      const maxPages = Math.ceil(this.history.length / this.maxNotis);
      this.paginationEl.textContent = `${this.currentPage + 1} / ${maxPages}`;
    }
  }

  updatePage() {
    if (this.history.length > this.maxNotis) {
      const maxPages = Math.ceil(this.history.length / this.maxNotis);
      if (this.currentPage >= maxPages) {
        this.currentPage = maxPages - 1;
      }
      this.updateHistory();
    }
  }

  updateHistory() {
    if (this.history.length > 0) {
      this.containerEl.innerHTML = '';
      const start = this.currentPage * this.maxNotis;
      const end = start + this.maxNotis;
      const history = this.history.slice(start, end);
      history.forEach((noti) => {
        this.containerEl.appendChild(noti.el);
      });

      this.updatePagination();
    }
  }

  hideInfo() {
    if (this.history.length > 0) {
      const infoEl = document.querySelector('.history-empty');
      if (infoEl) {
        this.containerEl.removeChild(infoEl);
      }
    }
  }

  showInfo() {
    if (this.history.length === 0) {
      const infoEl = document.createElement('p');
      infoEl.textContent = 'No notifications';
      infoEl.classList.add('history-empty');
      this.containerEl.appendChild(infoEl);
    }
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }

  debug() {
    for (let i = 0; i < 4; i++) {
      this.addNotification({
        title: `Notification ${i}`,
        message: 'Notification message',
        type: 'success',
      });
    }
  }
}

export default UseHistory;