const dateFns = require('date-fns')

const twentyFourHours = () => {
    const now = new Date();
    let hours = [];
    for (let i = 30; i >= 7; i--) {
        const day = new Date(now);
        
        day.setHours(day.getHours() - i);
        let hour = dateFns.format(day, 'H') + 'H';
        if (hour.length === 2) {
            hour = '0' + hour;
        }
        hours.push(hour);
    }
    return hours;
};

module.exports = twentyFourHours;
