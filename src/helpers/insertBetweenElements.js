export const insertBetweenElements = (arr, element) => {
    return arr.reduce((acc, current, index) => {
      // Add the current element
      acc.push(current);
      // Add the in-between element, except after the last element
      if (index < arr.length - 1) {
        acc.push(element);
      }
      return acc;
    }, []);
  }
  