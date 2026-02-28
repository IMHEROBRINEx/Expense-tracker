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
        <div className="max-w-md mx-auto mt-10 bg-surface rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="bg-primary px-6 py-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-2">
                    {isInitial ? 'Welcome to Budget Tracker' : 'Start New Term'}
                </h2>
                <p className="text-blue-100 text-sm">
                    Set your monthly budget to start tracking your expenses.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        End date will automatically be set to the last day of the month.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Monthly Budget ($)
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        placeholder="e.g. 2500"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow text-lg"
                    />
                </div>

                <div className="pt-2 flex gap-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex-[2] py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm shadow-blue-200"
                    >
                        Start Tracking
                    </button>
                </div>
            </form>
        </div>
    );
}
