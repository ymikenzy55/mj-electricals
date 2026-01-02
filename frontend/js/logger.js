// Production-safe logging utility
class Logger {
  constructor() {
    // Only enable detailed logging in development
    this.isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.startsWith('192.168.') ||
                         window.location.hostname.startsWith('10.');
    
    // Disable all console logs in production
    if (!this.isDevelopment) {
      this.disableConsole();
    }
  }

  disableConsole() {
    // Save original console methods
    this.originalConsole = {
      log: console.log,
      info: console.info,
      debug: console.debug
    };
    
    // Override console methods in production
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
  }

  log(...args) {
    if (this.isDevelopment && this.originalConsole) {
      this.originalConsole.log(...args);
    }
  }

  info(...args) {
    if (this.isDevelopment && this.originalConsole) {
      this.originalConsole.info(...args);
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
    if (this.isDevelopment && this.originalConsole) {
      this.originalConsole.debug(...args);
    }
  }
}

// Create global logger instance
const logger = new Logger();
window.logger = logger;

// Fallback: If logger is not loaded, create a simple console wrapper
if (typeof window.logger === 'undefined') {
  window.logger = {
    log: () => {},
    info: () => {},
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: () => {}
  };
}
