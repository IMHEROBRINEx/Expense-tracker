import { useState } from 'react';
import type { PaymentType } from '../types';
import { useExpenseTracker } from '../hooks/useExpenseTracker';
import { Plus, Tag, Calendar as CalendarIcon, DollarSign, FileText } from 'lucide-react';

interface ExpenseFormProps {
    onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
    const { addExpense, categories, activeTerm } = useExpenseTracker();

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

        addExpense({
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

    return (
        <div className="bg-surface rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800">Add Expense</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                            Amount
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-lg font-medium"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Tag className="w-4 h-4 text-slate-400" />
                            </div>
                            <select
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="date"
                                required
                                value={date}
                                min={activeTerm.startDate}
                                max={activeTerm.endDate}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Payment Type */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                            Payment Type
                        </label>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setType('cash')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${type === 'cash' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Cash
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('non-cash')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${type === 'non-cash' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Non-Cash
                            </button>
                        </div>
                    </div>
                </div>

                {/* Note */}
                <div className="mb-6">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Note (Optional)
                    </label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none min-h-[80px]"
                            placeholder="What was this expense for?"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm flex justify-center items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Save Expense
                </button>
            </form>
        </div>
    );
}
