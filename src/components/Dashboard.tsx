import { useMemo } from 'react';
import type { Term, Expense, Category } from '../types';
import { generateInsights } from '../utils/insightGenerator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Lightbulb } from 'lucide-react';

interface DashboardProps {
    term: Term;
    expenses: Expense[];
    categories: Category[];
}

const COLORS = ['#4F8CFF', '#22C55E', '#F59E0B', '#A855F7', '#EC4899', '#06B6D4', '#64748B'];

export function Dashboard({ term, expenses, categories }: DashboardProps) {
    const totalBudget = term.budget;
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalSpent;
    const percentUsed = Math.min((totalSpent / totalBudget) * 100, 100);

    const isOverspent = remaining < 0;

    const insights = useMemo(() => {
        return generateInsights(term, expenses, categories);
    }, [term, expenses, categories]);

    const categoryData = useMemo(() => {
        const sums: Record<string, number> = {};
        expenses.forEach(e => {
            sums[e.categoryId] = (sums[e.categoryId] || 0) + e.amount;
        });

        return Object.entries(sums)
            .map(([id, value]) => ({
                name: categories.find(c => c.id === id)?.name || 'Unknown',
                value
            }))
            .sort((a, b) => b.value - a.value);
    }, [expenses, categories]);

    const paymentData = useMemo(() => {
        const cash = expenses.filter(e => e.type === 'cash').reduce((sum, e) => sum + e.amount, 0);
        const nonCash = expenses.filter(e => e.type === 'non-cash').reduce((sum, e) => sum + e.amount, 0);
        const total = cash + nonCash || 1; // avoid division by zero
        return { cash, nonCash, cashP: (cash / total) * 100, nonCashP: (nonCash / total) * 100 };
    }, [expenses]);

    // Custom Tooltip for Recharts to match Dark Mode
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-card border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="text-white font-medium">{payload[0].name}</p>
                    <p className="text-primary-light font-bold">${Number(payload[0].value).toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">

            {/* Budget Summary Card */}
            <div className="glass-card hover:border-white/10 transition-colors duration-300 p-6 relative overflow-hidden group">
                {/* Subtle background glow effect overspent or healthy */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700
                    ${isOverspent ? 'bg-negative' : 'bg-primary'}`}></div>

                <h3 className="font-semibold text-zinc-100 mb-5 flex items-center gap-2 relative z-10">
                    <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
                        <DollarSign className="w-4 h-4 text-primary-light" />
                    </div>
                    Budget Overview
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-7 relative z-10">
                    <div className="bg-surface/50 border border-white/5 p-4 rounded-xl hover:bg-surface/80 transition-colors">
                        <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-2">Total Budget</div>
                        <div className="text-2xl font-bold text-white tracking-tight">
                            ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl relative overflow-hidden ${isOverspent ? 'bg-negative/10 border border-negative/20 text-negative' : 'bg-positive/10 border border-positive/20 text-positive'}`}>
                        <div className="text-xs font-medium uppercase tracking-wider mb-2 opacity-80">
                            Remaining
                        </div>
                        <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            ${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            {isOverspent ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between text-sm font-medium mb-3">
                        <span className="text-zinc-400">Total Spent <span className="text-white ml-2">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
                        <span className={isOverspent ? 'text-negative font-bold' : 'text-zinc-300 font-bold'}>{percentUsed.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-surface-card border border-white/5 rounded-full h-3.5 overflow-hidden shadow-inner relative">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out relative
                            ${isOverspent ? 'bg-gradient-to-r from-negative to-[#ff7b7b]' : 'bg-gradient-to-r from-primary to-primary-light'} `}
                            style={{ width: `${percentUsed}%` }}
                        >
                            {/* Shiny overlay on progress bar */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Insights */}
            <div className="glass-card bg-primary/5 hover:bg-primary/10 border-primary/20 p-6 transition-colors duration-300">
                <h3 className="font-semibold text-primary-light mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Insights
                </h3>
                <ul className="space-y-3">
                    {insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-zinc-300 leading-relaxed bg-surface/40 p-3.5 rounded-xl border border-white/5 flex items-start gap-3">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{insight}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Charts Section */}
            {expenses.length > 0 && (
                <div className="grid grid-cols-1 gap-6">
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-zinc-100 mb-6 flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
                                <PieChartIcon className="w-4 h-4 text-primary-light" />
                            </div>
                            Category Distribution
                        </h3>
                        <div className="h-[250px] w-full relative">
                            {/* Subtle chart glow map */}
                            <div className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none rounded-full"></div>

                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                        animationBegin={200}
                                        animationDuration={1000}
                                    >
                                        {categoryData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ color: '#A1A1AA', fontSize: '13px', paddingTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-zinc-100 mb-6 flex items-center gap-2">
                            <div className="p-1.5 bg-positive/10 rounded-lg border border-positive/20">
                                <TrendingUp className="w-4 h-4 text-positive" />
                            </div>
                            Payment Methods
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-zinc-300">Cash <span className="text-white ml-2">${paymentData.cash.toFixed(2)}</span></span>
                                    <span className="text-positive font-bold">{paymentData.cashP.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-surface-card border border-white/5 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-positive to-[#4ade80] h-full rounded-full transition-all duration-1000" style={{ width: `${paymentData.cashP}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-zinc-300">Non-Cash <span className="text-white ml-2">${paymentData.nonCash.toFixed(2)}</span></span>
                                    <span className="text-primary-light font-bold">{paymentData.nonCashP.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-surface-card border border-white/5 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full transition-all duration-1000" style={{ width: `${paymentData.nonCashP}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
