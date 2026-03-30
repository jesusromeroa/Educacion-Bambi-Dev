export const truncateText = ({text, maxlength}) => {
    return (text.length > maxlength) ?
    text.substring(0, maxlength) + '...'
    :
    text
}