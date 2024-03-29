

function addHoursToCurrentTime(hours) {
    const date = new Date();

    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date.toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'});

}


module.exports = {
    addHoursToCurrentTime
}