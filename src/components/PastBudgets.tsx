import { useState, useMemo } from 'react';
import type { Term, Expense, Category } from '../types';
import { formatDateDisplay } from '../utils/dateUtils';
import { generateInsights } from '../utils/insightGenerator';
import { formatCurrency } from '../utils/currencyUtils';
import { X, CalendarDays, TrendingDown, DollarSign, Lightbulb, PieChart as PieChartIcon, ArrowLeft, BarChart3, TrendingUp, Tags } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface PastBudgetsProps {
    terms: Term[];
    expenses: Expense[];
    categories: Category[];
    activeTerm: Term | null;
    onClose: () => void;
}

const COLORS = ['#4F8CFF', '#22C55E', '#F59E0B', '#A855F7', '#EC4899', '#06B6D4', '#64748B'];

export function PastBudgets({ terms, expenses, categories, activeTerm, onClose }: PastBudgetsProps) {
    const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

    // Only show terms that are NOT currently active
    const historicalTerms = useMemo(() => {
        return terms.filter(t => t.id !== activeTerm?.id).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }, [terms, activeTerm]);

    // View: List of Past Budgets
    if (!selectedTermId) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
                <div className="glass-card w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] lg:max-h-[85vh] animate-slide-up bg-surface/90 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-surface/50">
                        <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
                            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                                <CalendarDays className="w-6 h-6 text-primary-light" />
                            </div>
                            <h2>Past Budgets History</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        {historicalTerms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                                <div className="w-20 h-20 bg-surface/50 border border-white/5 rounded-full flex items-center justify-center mb-5 animate-pulse-subtle">
                                    <BarChart3 className="w-10 h-10 text-zinc-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No past budgets yet</h3>
                                <p className="text-zinc-400 text-sm max-w-sm">Complete your current term to see historical analytics and comparisons here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {historicalTerms.map(term => {
                                    const termExpenses = expenses.filter(e => e.termId === term.id);
                                    const totalSpent = termExpenses.reduce((sum, e) => sum + e.amount, 0);
                                    const remaining = term.budget - totalSpent;
                                    const isOverspent = remaining < 0;
                                    const percentUsed = Math.min((totalSpent / term.budget) * 100, 100);

                                    // Find highest category
                                    const catSums: Record<string, number> = {};
                                    termExpenses.forEach(e => catSums[e.categoryId] = (catSums[e.categoryId] || 0) + e.amount);
                                    let highestCat = 'N/A';
                                    let highestAmt = 0;
                                    Object.entries(catSums).forEach(([catId, amt]) => {
                                        if (amt > highestAmt) {
                                            highestAmt = amt;
                                            highestCat = categories.find(c => c.id === catId)?.name || 'Unknown';
                                        }
                                    });

                                    return (
                                        <div
                                            key={term.id}
                                            onClick={() => setSelectedTermId(term.id)}
                                            className="glass-card p-5 cursor-pointer group hover:bg-white/[0.02] hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                                        >
                                            {/* Glow on hover */}
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none"></div>

                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div>
                                                    <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                                                        {new Date(term.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                    </div>
                                                    <h4 className="font-bold text-white text-lg tracking-tight">
                                                        {formatDateDisplay(term.startDate)} - {formatDateDisplay(term.endDate)}
                                                    </h4>
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${isOverspent ? 'bg-negative/10 text-negative border-negative/20' : 'bg-positive/10 text-positive border-positive/20'}`}>
                                                    {isOverspent ? 'Overspent' : 'Under Budget'}
                                                </div>
                                            </div>

                                            <div className="space-y-4 relative z-10">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-400">Budget</span>
                                                    <span className="font-bold text-zinc-200">{formatCurrency(term.budget, term.currency)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-400">Total Spent</span>
                                                    <span className="font-bold text-white">{formatCurrency(totalSpent, term.currency)}</span>
                                                </div>

                                                <div className="w-full bg-surface-card border border-white/5 rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${isOverspent ? 'bg-negative/80' : 'bg-primary/80'}`}
                                                        style={{ width: `${percentUsed}%` }}
                                                    ></div>
                                                </div>

                                                {highestAmt > 0 && (
                                                    <div className="pt-3 border-t border-white/5 flex justify-between text-xs">
                                                        <span className="text-zinc-500 font-medium flex items-center gap-1.5"><Tags className="w-3 h-3" /> Top Expense</span>
                                                        <span className="font-bold text-zinc-300">{highestCat} ({formatCurrency(highestAmt, term.currency)})</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // View: Detailed Past Budget Breakdown
    const selectedTerm = terms.find(t => t.id === selectedTermId)!;
    const termExpenses = expenses.filter(e => e.termId === selectedTermId);
    const totalSpent = termExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = selectedTerm.budget - totalSpent;
    const isOverspent = remaining < 0;
    const percentUsed = Math.min((totalSpent / selectedTerm.budget) * 100, 100);

    const insights = generateInsights(selectedTerm, termExpenses, categories);

    const categoryData = useMemo(() => {
        const sums: Record<string, number> = {};
        termExpenses.forEach(e => {
            sums[e.categoryId] = (sums[e.categoryId] || 0) + e.amount;
        });
        return Object.entries(sums)
            .map(([id, value]) => ({
                name: categories.find(c => c.id === id)?.name || 'Unknown',
                value
            }))
            .sort((a, b) => b.value - a.value);
    }, [termExpenses, categories]);

    const paymentData = useMemo(() => {
        const cash = termExpenses.filter(e => e.type === 'cash').reduce((sum, e) => sum + e.amount, 0);
        const nonCash = termExpenses.filter(e => e.type === 'non-cash').reduce((sum, e) => sum + e.amount, 0);
        const total = cash + nonCash || 1;
        return { cash, nonCash, cashP: (cash / total) * 100, nonCashP: (nonCash / total) * 100 };
    }, [termExpenses]);

    // Comparison Logic
    let compareNode = null;
    if (activeTerm) {
        const activeExpenses = expenses.filter(e => e.termId === activeTerm.id);
        const activeSpent = activeExpenses.reduce((sum, e) => sum + e.amount, 0);

        // Calculate daily average for a fair comparison instead of absolute totals, since terms might have different lengths or be incomplete
        const getDays = (start: string, end: string) => {
            const d1 = new Date(start);
            const d2 = new Date(end);
            return Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
        };

        const activeDaysSoFar = getDays(activeTerm.startDate, new Date().toISOString().split('T')[0]);
        const pastTotalDays = getDays(selectedTerm.startDate, selectedTerm.endDate);

        const activeDailyAvg = activeSpent / Math.max(1, activeDaysSoFar);
        const pastDailyAvg = totalSpent / Math.max(1, pastTotalDays);

        const diffPercent = pastDailyAvg === 0 ? 0 : ((activeDailyAvg - pastDailyAvg) / pastDailyAvg) * 100;
        const isSpendingMore = diffPercent > 0;

        compareNode = (
            <div className={`p-5 rounded-xl border relative overflow-hidden group mb-6
                ${isSpendingMore ? 'bg-orange-500/5 border-orange-500/20' : 'bg-positive/5 border-positive/20'}`}>
                <div className={`absolute inset-0 blur-2xl opacity-20 pointer-events-none transition-colors 
                    ${isSpendingMore ? 'bg-orange-500' : 'bg-positive'}`}></div>

                <h4 className="text-xs font-bold tracking-widest uppercase mb-3 text-zinc-400 relative z-10">Comparison: Current Active Term</h4>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <div className="text-sm text-zinc-300 font-medium">Daily Avg Spend Limit</div>
                        <div className="font-bold text-lg mt-1 text-white">
                            {formatCurrency(activeDailyAvg, activeTerm.currency)} <span className="text-xs text-zinc-500 font-normal">/ day currently</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`flex items-center gap-1 font-bold text-lg ${isSpendingMore ? 'text-orange-400' : 'text-positive'}`}>
                            {isSpendingMore ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            {Math.abs(diffPercent).toFixed(1)}%
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">vs {formatCurrency(pastDailyAvg, selectedTerm.currency)} / day</div>
                    </div>
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-card border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="text-white font-medium">{payload[0].name}</p>
                    <p className="text-primary-light font-bold">{formatCurrency(payload[0].value, selectedTerm.currency)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
            <div className="glass-card w-full max-w-5xl overflow-hidden flex flex-col h-[95vh] animate-slide-up bg-surface/95 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-surface/80 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedTermId(null)}
                            className="p-2 bg-surface border border-white/10 text-zinc-400 rounded-xl hover:text-white hover:border-primary/40 hover:bg-primary/10 transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">Term Breakdown</div>
                            <h2 className="text-white font-bold text-lg tracking-tight">
                                {formatDateDisplay(selectedTerm.startDate)} – {formatDateDisplay(selectedTerm.endDate)}
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

                    {compareNode}

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div className="glass-card p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 relative z-10">Budget Set</div>
                            <div className="text-3xl font-bold text-white tracking-tight relative z-10">{formatCurrency(selectedTerm.budget, selectedTerm.currency)}</div>
                        </div>

                        <div className="glass-card p-5 relative overflow-hidden">
                            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 relative z-10">Total Spent</div>
                            <div className="text-3xl font-bold text-white tracking-tight relative z-10">{formatCurrency(totalSpent, selectedTerm.currency)}</div>
                            <div className="mt-3 w-full bg-surface-card rounded-full h-1.5 overflow-hidden">
                                <div className={`h-full rounded-full ${isOverspent ? 'bg-negative' : 'bg-primary'}`} style={{ width: `${percentUsed}%` }}></div>
                            </div>
                        </div>

                        <div className={`glass-card p-5 relative overflow-hidden border ${isOverspent ? 'border-negative/20 bg-negative/5' : 'border-positive/20 bg-positive/5'}`}>
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${isOverspent ? 'bg-negative/20' : 'bg-positive/20'}`}></div>
                            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 relative z-10 ${isOverspent ? 'text-negative/70' : 'text-positive/70'}`}>
                                {isOverspent ? 'Overspent By' : 'Remaining'}
                            </div>
                            <div className={`text-3xl font-bold tracking-tight relative z-10 ${isOverspent ? 'text-negative' : 'text-positive'}`}>
                                {formatCurrency(Math.abs(remaining), selectedTerm.currency)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                        {/* Charts Area */}
                        <div className="space-y-6">
                            <div className="glass-card p-6">
                                <h3 className="font-semibold text-zinc-100 mb-6 flex items-center gap-2">
                                    <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20"><PieChartIcon className="w-4 h-4 text-primary-light" /></div>
                                    Category Distribution
                                </h3>
                                {categoryData.length > 0 ? (
                                    <div className="h-[250px] w-full relative">
                                        <div className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none rounded-full"></div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none"
                                                >
                                                    {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <RechartsTooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ color: '#A1A1AA', fontSize: '13px', paddingTop: '10px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-zinc-500 font-medium">No expenses recorded.</div>
                                )}
                            </div>

                            <div className="glass-card p-6">
                                <h3 className="font-semibold text-zinc-100 mb-6 flex items-center gap-2">
                                    <div className="p-1.5 bg-positive/10 rounded-lg border border-positive/20"><DollarSign className="w-4 h-4 text-positive" /></div>
                                    Payment Methods
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between text-sm font-medium mb-2">
                                            <span className="text-zinc-300">Cash <span className="text-white ml-2">{formatCurrency(paymentData.cash, selectedTerm.currency)}</span></span>
                                            <span className="text-positive font-bold">{paymentData.cashP.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-surface-card border border-white/5 rounded-full h-2.5 overflow-hidden">
                                            <div className="bg-gradient-to-r from-positive to-[#4ade80] h-full rounded-full" style={{ width: `${paymentData.cashP}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm font-medium mb-2">
                                            <span className="text-zinc-300">Non-Cash <span className="text-white ml-2">{formatCurrency(paymentData.nonCash, selectedTerm.currency)}</span></span>
                                            <span className="text-primary-light font-bold">{paymentData.nonCashP.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-surface-card border border-white/5 rounded-full h-2.5 overflow-hidden">
                                            <div className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full" style={{ width: `${paymentData.nonCashP}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* List & Insights Area */}
                        <div className="space-y-6">
                            <div className="glass-card bg-primary/5 border-primary/20 p-6">
                                <h3 className="font-semibold text-primary-light mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-primary" /> Term Insights
                                </h3>
                                {insights.length > 0 ? (
                                    <ul className="space-y-3">
                                        {insights.map((insight, idx) => (
                                            <li key={idx} className="text-sm text-zinc-300 leading-relaxed bg-surface/40 p-3.5 rounded-xl border border-white/5 flex items-start gap-3">
                                                <span className="text-primary mt-0.5">•</span><span>{insight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-zinc-500">Not enough data to generate insights.</p>
                                )}
                            </div>

                            <div className="glass-card flex flex-col max-h-[500px]">
                                <h3 className="font-semibold text-zinc-100 p-6 pb-4 border-b border-white/5">All Transactions</h3>
                                <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
                                    {termExpenses.length > 0 ? (
                                        <div className="divide-y divide-white/5">
                                            {termExpenses.map(expense => (
                                                <div key={expense.id} className="p-4 flex justify-between items-center hover:bg-white/[0.02] rounded-xl transition-colors">
                                                    <div>
                                                        <div className="font-bold text-white text-sm">
                                                            {categories.find(c => c.id === expense.categoryId)?.name || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-zinc-500 mt-1 capitalize">
                                                            {formatDateDisplay(expense.date)} • {expense.type}
                                                        </div>
                                                        {expense.note && <div className="text-xs text-zinc-400 mt-1 truncate max-w-[200px]">{expense.note}</div>}
                                                    </div>
                                                    <div className="font-bold text-white whitespace-nowrap">
                                                        {formatCurrency(expense.amount, selectedTerm.currency)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center text-sm text-zinc-500">No transactions recorded.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
