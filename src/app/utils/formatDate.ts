export function FormatDate(date: Date, locale = 'default') {
    const now = new Date();
    const inputDate = new Date(date);

    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    
    if (inputDate.toDateString() === now.toDateString()) {
        // HH:MM PM/AM?
        return inputDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    } else if (isSameWeek(inputDate, now)) {
        // short weekday
        return inputDate.toLocaleDateString(locale, { weekday: 'short' });
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        // month day
        return inputDate.toLocaleDateString(locale, { month: 'short', day: '2-digit' });
    } else {
        // day:month:year?
        return inputDate.toLocaleDateString(locale);
    }
}

function isSameWeek(date1: Date, date2: Date) {
    const startOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday as start
        return new Date(d.setDate(diff));
    };

    const start1 = startOfWeek(date1).toDateString();
    const start2 = startOfWeek(date2).toDateString();

    return start1 === start2;
}
