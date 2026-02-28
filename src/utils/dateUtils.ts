export function getEndOfMonth(dateString: string): string {
    // Assuming dateString is YYYY-MM-DD
    const date = new Date(dateString);
    // Setting day to 0 of the *next* month gives the last day of the *current* month
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Format as YYYY-MM-DD local time to avoid timezone shifts
    const year = endOfMonth.getFullYear();
    const month = String(endOfMonth.getMonth() + 1).padStart(2, '0');
    const day = String(endOfMonth.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
