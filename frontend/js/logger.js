// Production-safe logging utility
class Logger {
  constructor() {
    // Only enable detailed logging in development
    this.isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.startsWith('192.168.') ||
                         window.location.hostname.startsWith('10.');
  }

  log(...args) {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }

  info(...args) {
    if (this.isDevelopment) {
      console.info(...args);
    }
  }

  warn(...args) {
    // Always show warnings
    console.warn(...args);
  }

  error(...args) {
    // Always show errors
    console.error(...args);
  }

  debug(...args) {
    if (this.isDevelopment) {
      console.debug(...args);
    }
  }
}

// Create global logger instance
const logger = new Logger();
window.logger = logger;

// Fallback: If logger is not loaded, create a simple console wrapper
if (typeof window.logger === 'undefined') {
  window.logger = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug.bind(console)
  };
}
