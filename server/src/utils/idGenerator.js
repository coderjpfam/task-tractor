/**
 * ID Generator Utility Functions
 * 
 * Generates sequential IDs with format: {PREFIX}-{YEAR}{ALPHABET}{NUMBER}
 * Example: U-2024A00001, U-2024A00002, ..., U-2024A99999, U-2024B00001
 */

/**
 * Generates the next ID based on the previous ID
 * @param {string|null} prevId - The previous ID (null if first ID)
 * @param {string} prefix - The prefix for the ID (default: "U" for User)
 * @returns {string} The next ID in sequence
 * 
 * @example
 * generateNextId(null, 'U') // Returns: "U-2024A00001"
 * generateNextId('U-2024A00001', 'U') // Returns: "U-2024A00002"
 * generateNextId('U-2024A99999', 'U') // Returns: "U-2024B00001"
 */
function generateNextId(prevId, prefix = "U") {
    const year = new Date().getFullYear();

    // If no previous ID
    if (!prevId) {
        return `${prefix}-${year}A00001`;
    }

    // Regex for 5 digit number
    const regex = new RegExp(`${prefix}-(\\d{4})([A-Z]+)(\\d{5})`);
    const match = prevId.match(regex);

    if (!match) {
        // If regex doesn't match, start fresh
        return `${prefix}-${year}A00001`;
    }

    let prevYear = match[1];
    let alpha = match[2];
    let num = parseInt(match[3]);

    // Reset if year changed
    if (parseInt(prevYear) !== year) {
        return `${prefix}-${year}A00001`;
    }

    // Increment number
    if (num < 99999) {
        num++;
        return `${prefix}-${year}${alpha}${num.toString().padStart(5, '0')}`;
    }

    // If number reached 99999 → reset & increment alphabet
    alpha = incrementAlphabet(alpha);
    return `${prefix}-${year}${alpha}00001`;
}

/**
 * Increments an alphabet string (A → B, Z → AA, etc.)
 * @param {string} str - The alphabet string to increment
 * @returns {string} The incremented alphabet string
 * 
 * @example
 * incrementAlphabet('A') // Returns: "B"
 * incrementAlphabet('Z') // Returns: "AA"
 * incrementAlphabet('AA') // Returns: "AB"
 * incrementAlphabet('ZZ') // Returns: "AAA"
 */
function incrementAlphabet(str) {
    let arr = str.split('');

    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] !== 'Z') {
            arr[i] = String.fromCharCode(arr[i].charCodeAt(0) + 1);
            return arr.join('');
        }
        arr[i] = 'A';
    }

    // All Z → add new letter
    return 'A' + arr.join('');
}

export {
    generateNextId,
    incrementAlphabet
};
