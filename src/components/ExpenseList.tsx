import { useState } from 'react';
import type { Expense, Category } from '../types';
import { formatDateDisplay } from '../utils/dateUtils';
import { Trash2, Wallet, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

interface ExpenseListProps {
    expenses: Expense[];
    categories: Category[];
    onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, categories, onDelete }: ExpenseListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (expenses.length === 0) {
        return (
            <div className="bg-surface rounded-2xl shadow-sm border border-slate-100 p-8 text-center mt-6">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-1">No expenses yet</h3>
                <p className="text-slate-500 text-sm">Add your first expense above to start tracking.</p>
            </div>
        );
    }

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

    return (
        <div className="bg-surface rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Recent Expenses</h3>
                <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                    {expenses.length} Total
                </span>
            </div>

            <div className="divide-y divide-slate-100">
                {expenses.map(expense => {
                    const isExpanded = expandedId === expense.id;

                    return (
                        <div key={expense.id} className="transition-colors hover:bg-slate-50/50">
                            <div
                                className="px-6 py-4 flex items-center justify-between cursor-pointer"
                                onClick={() => setExpandedId(isExpanded ? null : expense.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${expense.type === 'cash' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-primary'
                                        }`}>
                                        {expense.type === 'cash' ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                                            {getCategoryName(expense.categoryId)}
                                        </div>
                                        <div className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                                            <span>{formatDateDisplay(expense.date)}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="capitalize">{expense.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="font-bold text-slate-900 block">
                                            ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="text-slate-400">
                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="px-6 pb-4 pt-2 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
                                    {expense.note && (
                                        <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                                            <span className="font-semibold text-slate-700 block mb-1">Note:</span>
                                            {expense.note}
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2">
                                        {/* Basic edit option could be added here, for now simple delete is implemented to fulfill constraints cleanly. If needed, we can trigger a modal or populate the form directly. */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm("Delete this expense?")) {
                                                    onDelete(expense.id);
                                                }
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
