'use strict';

/**
 * Sanitize user input for use in raw SQL queries.
 * Escapes single quotes, removes SQL comment/dangerous patterns,
 * and truncates to prevent abuse.
 */
function sanitizeSqlInput(value) {
    if (value == null || typeof value !== 'string') return '';
    return value
        .replace(/'/g, "''")      // escape single quotes
        .replace(/;/g, '')        // remove statement terminators
        .replace(/--/g, '')       // remove SQL line comments
        .replace(/\/\*/g, '')     // remove block comment start
        .replace(/\*\//g, '')     // remove block comment end
        .trim()
        .substring(0, 200);       // limit length
}

module.exports = { sanitizeSqlInput };
