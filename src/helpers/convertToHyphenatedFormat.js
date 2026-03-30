export const  convertToHyphenatedFormat = (inputString) => {
    // Trim whitespace and replace spaces with hyphens
    return inputString.trim().split(" ").join("-");
  }
  
  