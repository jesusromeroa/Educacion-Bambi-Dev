export const convertToSpacedFormat = (inputString) => {
    // Replace hyphens with spaces
    return inputString.trim().split("-").join(" ");
  }
  