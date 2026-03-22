export function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older WebViews or insecure context where crypto.randomUUID is not available
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
