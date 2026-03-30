export const convertPathToArray = (pathString) => {
    const array = pathString.split("/");
    array.shift(); //to eliminate the starting "/"
    return array;
}