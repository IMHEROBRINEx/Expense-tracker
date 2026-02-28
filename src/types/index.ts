export type PaymentType = 'cash' | 'non-cash';

export interface Category {
    id: string;
    name: string;
    isDefault: boolean;
}

export interface Expense {
    id: string;
    termId: string;
    amount: number;
    categoryId: string;
    type: PaymentType;
    date: string; // ISO date string YYYY-MM-DD format
    note: string;
}

export interface Term {
    id: string;
    startDate: string; // ISO date string YYYY-MM-DD
    endDate: string; // ISO date string YYYY-MM-DD
    budget: number;
    currency: string; // e.g. 'USD', 'INR', 'EUR'
}
