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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

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

    return (
        <div className="space-y-6">

            {/* Budget Summary Card */}
            <div className="bg-surface rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Budget Summary
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="text-sm text-slate-500 font-medium mb-1">Total Budget</div>
                        <div className="text-2xl font-bold text-slate-800">
                            ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl ${isOverspent ? 'bg-red-50' : 'bg-emerald-50'}`}>
                        <div className={`text-sm font-medium mb-1 ${isOverspent ? 'text-red-600' : 'text-emerald-700'}`}>
                            Remaining Budget
                        </div>
                        <div className={`text-2xl font-bold flex items-center gap-2 ${isOverspent ? 'text-red-700' : 'text-emerald-700'}`}>
                            ${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            {isOverspent ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-600">Total Spent: ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className={isOverspent ? 'text-red-500' : 'text-slate-600'}>{percentUsed.toFixed(1)}% Used</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isOverspent ? 'bg-red-500' : 'bg-primary'}`}
                            style={{ width: `${percentUsed}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Smart Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    Smart Insights
                </h3>
                <ul className="space-y-3">
                    {insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-blue-800 bg-white/60 p-3 rounded-lg border border-blue-100">
                            {insight}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Charts Section */}
            {expenses.length > 0 && (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-surface rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-primary" />
                            Category Analysis
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {categoryData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Payment Mode</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span className="text-emerald-600">Cash (${paymentData.cash.toFixed(2)})</span>
                                    <span className="text-emerald-600">{paymentData.cashP.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${paymentData.cashP}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span className="text-primary">Non-Cash (${paymentData.nonCash.toFixed(2)})</span>
                                    <span className="text-primary">{paymentData.nonCashP.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${paymentData.nonCashP}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
