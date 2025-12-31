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

const logger = new Logger();
window.logger = logger;
