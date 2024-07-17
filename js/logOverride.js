(function() {
    const logContainer = document.getElementById('log-container');

    function createLogMessage(message, className) {
        const logMessage = document.createElement('div');
        logMessage.className = 'log ' + className;
        logMessage.textContent = message;
        logContainer.appendChild(logMessage);
        logContainer.scrollTop = logContainer.scrollHeight; // Auto-scroll to the latest message
    }

    function formatError(error) {
        return `${error.message}\n${error.stack}`;
    }

    const originalLog = console.log;
    console.log = function(message, ...optionalParams) {
        createLogMessage(message, '');
        originalLog.apply(console, [message, ...optionalParams]);
    };

    const originalError = console.error;
    console.error = function(message, ...optionalParams) {
        if (message instanceof Error) {
            createLogMessage(formatError(message), 'error');
        } else {
            createLogMessage(message, 'error');
        }
        originalError.apply(console, [message, ...optionalParams]);
    };

    const originalWarn = console.warn;
    console.warn = function(message, ...optionalParams) {
        createLogMessage(message, 'warn');
        originalWarn.apply(console, [message, ...optionalParams]);
    };

    const originalInfo = console.info;
    console.info = function(message, ...optionalParams) {
        createLogMessage(message, 'info');
        originalInfo.apply(console, [message, ...optionalParams]);
    };
})();
