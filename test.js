function trimPeriodsAndCommas(str) {
  return str.replace(/^[.,]+|[.,]+$/g, '');
}

// Example usage:
let inputString = 'U . S . A ...';
let trimmedString = trimPeriodsAndCommas(inputString);
console.log(trimmedString); // Outputs: "Hello, World"
