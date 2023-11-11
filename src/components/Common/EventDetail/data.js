const date = new Date();
const formatDate = ({ date, month, year }) => {
    if (date < 10) {
        date = `0${date}`;
    };
    if (month < 10) {
        month = `0${month}`;
    };
    return `${year}-${month}-${date}`
};
export const currentDate = formatDate({
    date: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
});