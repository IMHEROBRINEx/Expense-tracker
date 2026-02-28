import { useState } from 'react';
import type { Expense, Category } from '../types';
import { formatDateDisplay } from '../utils/dateUtils';
import { formatCurrency } from '../utils/currencyUtils';
import { Trash2, Wallet, CreditCard, ChevronDown } from 'lucide-react';

interface ExpenseListProps {
    expenses: Expense[];
    categories: Category[];
    activeCurrency: string;
    onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, categories, activeCurrency, onDelete }: ExpenseListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (expenses.length === 0) {
        return (
            <div className="glass-card hover:border-white/10 transition-colors duration-300 p-10 text-center mt-6 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-surface/50 border border-white/5 rounded-full flex items-center justify-center mb-5 animate-pulse-subtle">
                    <Wallet className="w-10 h-10 text-zinc-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No expenses yet</h3>
                <p className="text-zinc-400 text-sm">Add your first expense above to start tracking your term.</p>
            </div>
        );
    }

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

    return (
        <div className="glass-card hover:border-white/10 transition-colors duration-300 overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-white/5 bg-surface/30 flex justify-between items-center">
                <h3 className="font-semibold text-zinc-100 tracking-wide text-sm uppercase">Recent Expenses</h3>
                <span className="text-xs font-bold text-primary-light bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {expenses.length} Total
                </span>
            </div>

            <div className="divide-y divide-white/5">
                {expenses.map(expense => {
                    const isExpanded = expandedId === expense.id;

                    return (
                        <div key={expense.id} className="transition-all duration-200 hover:bg-white/[0.02]">
                            <div
                                className="px-6 py-5 flex items-center justify-between cursor-pointer group"
                                onClick={() => setExpandedId(isExpanded ? null : expense.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border 
                                        ${expense.type === 'cash'
                                            ? 'bg-positive/10 text-positive border-positive/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                                            : 'bg-primary/10 text-primary-light border-primary/20 shadow-[0_0_15px_rgba(79,140,255,0.1)]'
                                        }`}>
                                        {expense.type === 'cash' ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-zinc-100 flex items-center gap-2 group-hover:text-white transition-colors">
                                            {getCategoryName(expense.categoryId)}
                                        </div>
                                        <div className="text-sm text-zinc-500 flex items-center gap-2 mt-1 font-medium">
                                            <span>{formatDateDisplay(expense.date)}</span>
                                            <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                                            <span className={`capitalize ${expense.type === 'cash' ? 'text-positive/80' : 'text-primary-light/80'}`}>
                                                {expense.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="text-right">
                                        <span className="font-bold text-white block text-lg tracking-tight">
                                            {formatCurrency(expense.amount, activeCurrency)}
                                        </span>
                                    </div>
                                    <div className={`text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-5 h-5 group-hover:text-zinc-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Area with Animation */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-6 pb-5 pt-2 bg-black/20 border-t border-white/5 flex flex-col gap-4">
                                    {expense.note && (
                                        <div className="text-sm text-zinc-300 leading-relaxed bg-surface/50 p-4 rounded-xl border border-white/5">
                                            <span className="font-semibold text-zinc-500 block mb-1.5 uppercase tracking-wider text-xs">Note</span>
                                            {expense.note}
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm("Are you sure you want to delete this expense?")) {
                                                    onDelete(expense.id);
                                                }
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-negative-light bg-negative/5 hover:bg-negative/20 rounded-xl transition-all duration-200 border border-negative/20 hover:border-negative/40 active:scale-95 shadow-[0_0_10px_rgba(239,68,68,0.05)] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
