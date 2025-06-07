export function generateUniqueUsername(): string {
  // Ensure number is between 100-999 to maintain consistent length
  const number = 100 + Math.floor(Math.random() * 900);
  return `testUser${number}`;
}
