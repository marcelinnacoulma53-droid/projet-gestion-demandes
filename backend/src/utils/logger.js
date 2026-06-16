// ============================================================
// LOGGER (M3)
// Journalisation des événements
// ============================================================

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const getTimestamp = () => {
    return new Date().toLocaleTimeString('fr-FR');
};

const info = (message, ...args) => {
    console.log(`${colors.green}[INFO]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
};

const warn = (message, ...args) => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
};

const error = (message, ...args) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
};

const debug = (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
        console.debug(`${colors.cyan}[DEBUG]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
    }
};

const api = (method, url, status) => {
    const statusColor = status >= 400 ? colors.red : colors.green;
    console.log(`${colors.blue}[API]${colors.reset} ${getTimestamp()} - ${method} ${url} - ${statusColor}${status}${colors.reset}`);
};

const errorWithStack = (err, context) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${getTimestamp()} - ${context}`);
    console.error(`${colors.red}Stack:${colors.reset} ${err.stack}`);
};

module.exports = { info, warn, error, debug, api, errorWithStack };