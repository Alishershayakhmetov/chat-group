export function FormatDate(dateString: string, locale = 'default') {
    const date = new Date(dateString); // Convert the string to a Date object
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        // Return HH:MM AM/PM for today's date
        return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    } else if (isSameWeek(date, now)) {
        // Return short weekday for dates in the same week
        return date.toLocaleDateString(locale, { weekday: 'short' });
    } else if (date.getFullYear() === now.getFullYear()) {
        // Return month day for dates in the current year
        return date.toLocaleDateString(locale, { month: 'short', day: '2-digit' });
    } else {
        // Return the full date for other cases
        return date.toLocaleDateString(locale);
    }
}

export function extractTime(dateString: string, locale = 'default') {
    const date = new Date(dateString);
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