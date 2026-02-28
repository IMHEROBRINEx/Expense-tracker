import { useState } from 'react';
import type { PaymentType, Category, Term, Expense } from '../types';
import { SUPPORTED_CURRENCIES } from '../utils/currencyUtils';
import { Plus, Tag, Calendar as CalendarIcon, FileText } from 'lucide-react';

interface ExpenseFormProps {
    categories: Category[];
    activeTerm: Term | null;
    onAddExpense: (data: Omit<Expense, 'id' | 'termId'>) => void;
    onSuccess?: () => void;
}

export function ExpenseForm({ categories, activeTerm, onAddExpense, onSuccess }: ExpenseFormProps) {

    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
    const [type, setType] = useState<PaymentType>('non-cash');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !categoryId || !date || !activeTerm) return;

        // Ensure date is within active term
        const expDate = new Date(date);
        const startDate = new Date(activeTerm.startDate);
        const endDate = new Date(activeTerm.endDate);

        // Simple validation
        if (expDate < startDate || expDate > endDate) {
            alert(`Date must be within the active term (${activeTerm.startDate} to ${activeTerm.endDate})`);
            return;
        }

        onAddExpense({
            amount: parseFloat(amount),
            categoryId,
            type,
            date,
            note
        });

        // Reset form
        setAmount('');
        setNote('');
        if (onSuccess) onSuccess();
    };

    if (!activeTerm) return null;

    const activeSymbol = SUPPORTED_CURRENCIES[activeTerm.currency]?.symbol || '$';

    return (
        <div className="glass-card hover:border-white/10 transition-colors duration-300 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 bg-surface/30 flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
                    <Plus className="w-4 h-4 text-primary-light" />
                </div>
                <h3 className="font-semibold text-zinc-100 tracking-wide text-sm uppercase">Add Expense</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Amount */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                            Amount
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-primary transition-colors font-bold text-lg">
                                {activeSymbol}
                            </div>
                            <input
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-white/5 rounded-xl focus:bg-surface focus:ring-1 focus:ring-primary/50 focus:border-primary outline-none transition-all text-xl font-bold text-white placeholder-zinc-600 shadow-inner"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                            Category
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Tag className="w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                            </div>
                            <select
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-surface/50 border border-white/5 rounded-xl focus:bg-surface focus:ring-1 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none text-zinc-100 shadow-inner cursor-pointer"
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id} className="bg-surface text-white">{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                            Date
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <CalendarIcon className="w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="date"
                                required
                                value={date}
                                min={activeTerm.startDate}
                                max={activeTerm.endDate}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-white/5 rounded-xl focus:bg-surface focus:ring-1 focus:ring-primary/50 focus:border-primary outline-none transition-all text-zinc-100 shadow-inner [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Payment Type (Segmented Pill Toggle) */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Payment Method
                        </label>
                        <div className="flex bg-surface/50 border border-white/5 p-1 rounded-xl shadow-inner relative z-0">
                            {/* Animated Background Selector */}
                            <div
                                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-surface-card border border-white/10 rounded-lg shadow-md transition-transform duration-300 ease-out z-[-1]
                                ${type === 'cash' ? 'translate-x-0' : 'translate-x-[calc(100%+8px)]'}`}
                            />

                            <button
                                type="button"
                                onClick={() => setType('cash')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${type === 'cash' ? 'text-positive' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Cash
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('non-cash')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${type === 'non-cash' ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Non-Cash
                            </button>
                        </div>
                    </div>
                </div>

                {/* Note */}
                <div className="mb-6 group">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                        Note (Optional)
                    </label>
                    <div className="relative">
                        <div className="absolute top-4 left-3.5 pointer-events-none">
                            <FileText className="w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-white/5 rounded-xl focus:bg-surface focus:ring-1 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none min-h-[90px] text-zinc-100 placeholder-zinc-600 shadow-inner"
                            placeholder="What was this expense for? (e.g. Groceries at Whole Foods)"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-primary/10 border border-primary/20 text-primary-light rounded-xl font-bold hover:bg-primary hover:text-white transition-all duration-300 flex justify-center items-center gap-2 active:scale-[0.98] shadow-[0_0_20px_rgba(79,140,255,0.05)] hover:shadow-[0_4px_20px_rgba(79,140,255,0.25)]"
                >
                    <Plus className="w-5 h-5" />
                    Save Expense
                </button>
            </form>
        </div>
    );
}
