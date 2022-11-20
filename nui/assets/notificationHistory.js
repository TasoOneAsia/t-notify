class NotificationHistory {
  count = 0;
  maxNotis = 4;
  history = [];
  paginationEl = null;
  position = null;
  containerEl = null;
  infoEl = null;
  constructor(position) {
    this.history = [];
    this.position = position;
    this.paginationEl = document.getElementById('history-pagination');
    this.containerEl = document.getElementById('notification-history');
    this.infoEl = document.getElementById('history-info');
  }

  addNotification(noti) {
    const { title, message, type } = noti;
    const container = document.createElement('div');
    const footer = document.createElement('div');
    const titleEl = document.createElement('h2');
    const messageEl = document.createElement('p');
    const time = document.createElement('span');
    const deleteBtn = document.createElement('button');

    this.count++;
    container.id = `notification-${this.count}`;
    container.classList.add(`gn-${type}`);
    titleEl.textContent = title;
    messageEl.textContent = message;
    deleteBtn.textContent = 'Delete';

    container.classList.add('history-notification');
    time.textContent = new Date().toLocaleTimeString();
    footer.appendChild(time);
    footer.appendChild(deleteBtn);
    container.append(titleEl, messageEl, footer);
    this.containerEl.appendChild(container);

    this.history.push({
      id: container.id,
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
  }

  hideInfo() {
    if (this.history.length > 0) {
      this.infoEl.style.display = 'none';
    }
  }

  showInfo() {
    if (this.history.length === 0) {
      this.infoEl.style.display = 'block';
    }
  }

  updatePagination() {
    this.paginationEl.textContent = `${this.history.length} / ${this.history.length}`;
  }

  getHistory() {
    return this.history;
  }

  getHistoryLength() {
    return this.history.length;
  }

  clearHistory() {
    this.history = [];

  }
}

export default NotificationHistory;