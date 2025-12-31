// Modal utility for showing messages
const Modal = {
  overlay: null,

  init() {
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'modal-overlay';
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
      document.body.appendChild(this.overlay);
    }
  },

  show(options) {
    this.init();

    const {
      title = 'Message',
      message = '',
      type = 'info', // success, error, info, warning
      confirmText = 'OK',
      cancelText = null,
      onConfirm = null,
      onCancel = null
    } = options;

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };

    const titles = {
      success: title || 'Success',
      error: title || 'Error',
      info: title || 'Information',
      warning: title || 'Warning'
    };

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <button class="modal-close" onclick="Modal.close()">×</button>
      <div class="modal-header">
        <div class="modal-icon ${type}">${icons[type]}</div>
        <h2 class="modal-title">${titles[type]}</h2>
      </div>
      <div class="modal-body">${message}</div>
      <div class="modal-footer">
        ${cancelText ? `<button class="btn btn-secondary" onclick="Modal.handleCancel()">${cancelText}</button>` : ''}
        <button class="btn" onclick="Modal.handleConfirm()">${confirmText}</button>
      </div>
    `;

    this.overlay.innerHTML = '';
    this.overlay.appendChild(modal);
    this.overlay.classList.add('active');

    this.onConfirm = onConfirm;
    this.onCancel = onCancel;

    // Auto close after 3 seconds if no cancel button and not explicitly disabled
    if (!cancelText && options.autoClose !== false) {
      setTimeout(() => this.close(), 3000);
    }
  },

  handleConfirm() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.close();
  },

  handleCancel() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.close();
  },

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
  },

  success(message, title = 'Success') {
    this.show({ type: 'success', title, message });
  },

  error(message, title = 'Error') {
    this.show({ type: 'error', title, message });
  },

  info(message, title = 'Information') {
    this.show({ type: 'info', title, message });
  },

  warning(message, title = 'Warning') {
    this.show({ type: 'warning', title, message });
  },

  confirm(message, onConfirm, onCancel = null) {
    this.show({
      type: 'warning',
      title: 'Confirm',
      message,
      confirmText: 'Yes',
      cancelText: 'Cancel',
      onConfirm,
      onCancel
    });
  }
};

// Make it globally available
window.Modal = Modal;

// Replace native alert and confirm
window.showAlert = function(message, type = 'info') {
  Modal.show({ type, message });
};

window.showConfirm = function(message, callback) {
  Modal.confirm(message, callback);
};
