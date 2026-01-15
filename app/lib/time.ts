import { toZonedTime } from 'date-fns-tz';
import { getDayOfYear, isLeapYear, differenceInDays, startOfYear, endOfYear, format } from 'date-fns';

export function getYearProgress(timezone: string = 'UTC') {
    const now = new Date();
    const zonedDate = toZonedTime(now, timezone);
    const year = zonedDate.getFullYear();

    const start = startOfYear(zonedDate);
    const end = endOfYear(zonedDate);

    // Total days in year (365 or 366)
    const totalDays = isLeapYear(zonedDate) ? 366 : 365;

    // Days passed (1-based day of year)
    const dayOfYear = getDayOfYear(zonedDate);

    // Days left
    const daysLeft = totalDays - dayOfYear;

    // Percentage
    const percentage = ((dayOfYear / totalDays) * 100).toFixed(1);

    return {
        year,
        dayOfYear,
        daysLeft,
        totalDays,
        percentage,
        dateString: format(zonedDate, 'EEEE, d MMMM'),
        timeString: format(zonedDate, 'h:mm a'),
        generatedAt: format(zonedDate, "HH:mm' on 'dd MMM"),
    };
}
