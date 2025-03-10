const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFarsiNumber(n) {
    const value =  n
    ?.toString()
    .split('')
    .map(x => farsiDigits[x] || x)
    .join('');
  
    return value;
}

// New function to convert Farsi numbers to English numbers
export function toEnglishNumber(farsiStr) {
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
    const value = farsiStr
    .split('')
    .map(x => {
        const index = farsiDigits.indexOf(x);
        return index !== -1 ? englishDigits[index] : x;
    })
    .join('');
  
    return value;
}

// New function to check if all characters in the string are English numbers
export function isAllEnglishNumbers(str) {
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
    return str.split('').every(char => englishDigits.includes(char));
}