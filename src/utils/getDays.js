const dateFns = require('date-fns')

const sevenDays = () => {
    const now = new Date();
    let days = [];
    for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        days.push(dateFns.format(day, 'yyyy-MM-dd'));
    }

    return days;
};

const thirtyDays = () => {
    const now = new Date();
    let days = [];
    for (let i = 30; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        days.push(dateFns.format(day, 'yyyy-MM-dd'));
    }

    return days;
}

module.exports = {
    sevenDays,
    thirtyDays
};
