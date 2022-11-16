const dateFns = require('date-fns')

const twentyFourHours = () => {
    const now = new Date();
    let hours = [];
    for (let i = 23; i >= 0; i--) {
        const day = new Date(now);
        day.setHours(day.getHours() - i);
        hours.push(dateFns.format(day, 'H'));
    }

    return hours;
};

module.exports = twentyFourHours;
