export function FormatDate(date: Date, locale = 'default') {
    const now = new Date();

    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    
    if (date.toDateString() === now.toDateString()) {
        // HH:MM PM/AM?
        return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    } else if (isSameWeek(date, now)) {
        // short weekday
        return date.toLocaleDateString(locale, { weekday: 'short' });
    } else if (date.getFullYear() === now.getFullYear()) {
        // month day
        return date.toLocaleDateString(locale, { month: 'short', day: '2-digit' });
    } else {
        // day:month:year?
        return date.toLocaleDateString(locale);
    }
}

export function extractTime(date: Date, locale = 'default') {
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
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