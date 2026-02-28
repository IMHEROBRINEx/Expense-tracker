import { useLocalStorage } from './useLocalStorage';
import type { Term, Expense, Category } from '../types';
import { getEndOfMonth } from '../utils/dateUtils';

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'cat-food', name: 'Food', isDefault: true },
    { id: 'cat-travel', name: 'Travel', isDefault: true },
    { id: 'cat-rent', name: 'Rent', isDefault: true },
    { id: 'cat-bills', name: 'Bills', isDefault: true },
    { id: 'cat-shopping', name: 'Shopping', isDefault: true },
    { id: 'cat-other', name: 'Other', isDefault: true },
];

export function useExpenseTracker() {
    const [globalCurrency, setGlobalCurrency] = useLocalStorage<string>('et_global_currency', 'USD');
    const [terms, setTerms] = useLocalStorage<Term[]>('et_terms', []);
    const [activeTermId, setActiveTermId] = useLocalStorage<string | null>('et_active_term', null);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('et_expenses', []);
    const [categories, setCategories] = useLocalStorage<Category[]>('et_categories', DEFAULT_CATEGORIES);

    // Computed state for UI convenience
    const activeTerm = terms.find((t) => t.id === activeTermId) || null;
    const activeTermExpenses = activeTermId ? expenses.filter((e) => e.termId === activeTermId) : [];

    const startNewTerm = (startDate: string, budget: number) => {
        const endDate = getEndOfMonth(startDate);
        const newTerm: Term = {
            id: crypto.randomUUID(),
            startDate,
            endDate,
            budget,
            currency: globalCurrency // Inherit from global preference at start
        };

        // Sort terms by start date descending
        const newTerms = [...terms, newTerm].sort((a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );

        setTerms(newTerms);
        setActiveTermId(newTerm.id);
    };

    const updateTermBudget = (termId: string, budget: number) => {
        setTerms(terms.map((t) => t.id === termId ? { ...t, budget } : t));
    };

    const updateTermCurrency = (termId: string, currency: string) => {
        setTerms(terms.map((t) => t.id === termId ? { ...t, currency } : t));
    };

    const deleteTerm = (termId: string) => {
        setTerms(terms.filter((t) => t.id !== termId));
        setExpenses(expenses.filter((e) => e.termId !== termId));
        if (activeTermId === termId) {
            setActiveTermId(null);
        }
    };

    const addExpense = (expenseData: Omit<Expense, 'id' | 'termId'>) => {
        if (!activeTermId) return;
        const newExpense: Expense = {
            ...expenseData,
            id: crypto.randomUUID(),
            termId: activeTermId,
        };
        // Keep sorted by date descending mostly
        const newExpenses = [newExpense, ...expenses].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setExpenses(newExpenses);
    };

    const updateExpense = (id: string, expenseData: Partial<Expense>) => {
        setExpenses(expenses.map((e) => e.id === id ? { ...e, ...expenseData } : e));
    };

    const deleteExpense = (id: string) => {
        setExpenses(expenses.filter((e) => e.id !== id));
    };

    const resetCurrentTerm = () => {
        if (!activeTermId) return;
        setExpenses(expenses.filter((e) => e.termId !== activeTermId));
    };

    const endCurrentTerm = () => {
        if (!activeTermId) return;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        setTerms(terms.map((t) => t.id === activeTermId ? { ...t, endDate: todayStr } : t));
        setActiveTermId(null);
    };

    const addCategory = (name: string) => {
        const newCategory: Category = {
            id: `cat-${crypto.randomUUID()}`,
            name,
            isDefault: false
        };
        setCategories([...categories, newCategory]);
    };

    const deleteCategory = (id: string) => {
        setCategories(categories.filter((c) => c.id !== id));
        // Optional: maybe handle expenses with deleted category by moving to 'Other'
    };

    const updateCategory = (id: string, name: string) => {
        setCategories(categories.map((c) => c.id === id ? { ...c, name } : c));
    };

    return {
        // State
        globalCurrency,
        terms,
        activeTermId,
        activeTerm,
        expenses,
        activeTermExpenses,
        categories,
        // Actions
        setGlobalCurrency,
        setActiveTermId,
        startNewTerm,
        updateTermBudget,
        updateTermCurrency,
        deleteTerm,
        addExpense,
        updateExpense,
        deleteExpense,
        resetCurrentTerm,
        endCurrentTerm,
        addCategory,
        deleteCategory,
        updateCategory
    };
}
