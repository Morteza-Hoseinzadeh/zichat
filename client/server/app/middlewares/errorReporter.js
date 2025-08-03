const { writeFileSync, existsSync, appendFileSync, readFileSync } = require('fs');
const path = require('path');
const ERROR_LOG_FILE = path.join(__dirname, '../logs/errorReports.json');

// Initialize error log file if it doesn't exist
if (!existsSync(ERROR_LOG_FILE)) {
  writeFileSync(ERROR_LOG_FILE, JSON.stringify([], null, 2));
}

function logError(error, req = {}) {
  const errorReport = {
    timestamp: new Date().toISOString(),
    path: req.originalUrl || 'Unknown route',
    method: req.method || 'Unknown method',
    error: { name: error.name, message: error.message, stack: error.stack },
    user: req?.user?.id && req?.user?.username ? { id: req.user.id, username: req.user.username } : 'Unauthenticated',
    ip: req.ip || 'Unknown IP',
    headers: req.headers || {},
  };

  const currentLogs = JSON.parse(readFileSync(ERROR_LOG_FILE, 'utf8'));
  currentLogs.push(errorReport);
  writeFileSync(ERROR_LOG_FILE, JSON.stringify(currentLogs, null, 2));
}

// Admin route to get error reports
function getErrorReports(req, res) {
  try {
    const errorLogs = JSON.parse(readFileSync(ERROR_LOG_FILE, 'utf8'));
    res.json(errorLogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve error logs' });
  }
}

module.exports = { logError, getErrorReports };
