import { useState } from 'react';

interface TermSetupProps {
    onStart: (startDate: string, budget: number) => void;
    onCancel?: () => void;
    isInitial?: boolean;
}

export function TermSetup({ onStart, onCancel, isInitial = false }: TermSetupProps) {
    // Default to today's date
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [budget, setBudget] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const budgetNum = parseFloat(budget);
        if (!startDate || isNaN(budgetNum) || budgetNum <= 0) return;
        onStart(startDate, budgetNum);
    };

    return (
        <div className="max-w-md mx-auto mt-10 glass-card overflow-hidden">
            <div className="bg-surface px-6 py-8 text-center border-b border-white/5 relative">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary-light"></div>
                <h2 className="text-2xl font-bold mb-2 text-white tracking-tight">
                    {isInitial ? 'Welcome to Budget Tracker' : 'Start New Term'}
                </h2>
                <p className="text-zinc-400 text-sm">
                    Set your monthly budget to start tracking your expenses.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-surface-card outline-none transition-all text-zinc-100 placeholder-zinc-500"
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                        End date will automatically be set to the last day of the month.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Monthly Budget ($)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">$</span>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            placeholder="2500"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-surface-card outline-none transition-all text-xl text-white font-semibold placeholder-zinc-600"
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 px-4 bg-surface text-zinc-300 rounded-xl font-medium border border-white/5 hover:bg-white/5 active:scale-95 transition-all text-sm"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex-[2] py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-all shadow-[0_4px_14px_rgba(79,140,255,0.39)] hover:shadow-[0_6px_20px_rgba(79,140,255,0.45)] hover:-translate-y-0.5 active:scale-95 text-base"
                    >
                        Start Tracking
                    </button>
                </div>
            </form>
        </div>
    );
}
