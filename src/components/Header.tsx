import type { Term } from '../types';
import { formatDateDisplay } from '../utils/dateUtils';
import { Calendar, PlusCircle, Settings, Wallet, Tags, History } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';

interface HeaderProps {
    activeTerm: Term | null;
    globalCurrency: string;
    onUpdateCurrency: (currency: string) => void;
    onStartNew: () => void;
    onManageTerms: () => void;
    onManageCategories: () => void;
    onOpenPastBudgets: () => void;
}

export function Header({
    activeTerm,
    globalCurrency,
    onUpdateCurrency,
    onStartNew,
    onManageTerms,
    onManageCategories,
    onOpenPastBudgets
}: HeaderProps) {
    return (
        <header className="bg-surface/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/5 sticky top-0 z-40 py-5 px-4 sm:px-6 transition-all">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                {/* Logo / App Name */}
                <div className="flex items-center gap-3 text-primary group cursor-pointer hover:opacity-90 transition-opacity">
                    <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(79,140,255,0.15)]">
                        <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-primary-light transition-colors hidden sm:block">
                        Budget Tracker
                    </h1>
                </div>

                {/* Active Term Display & Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 flex-1">

                    {/* Top Right Utilities (Currency & Past Budgets) */}
                    <div className="flex items-center gap-2 border-r border-white/10 pr-3 mr-1">
                        <CurrencySelector
                            value={globalCurrency}
                            onChange={onUpdateCurrency}
                        />
                        <button
                            onClick={onOpenPastBudgets}
                            className="flex items-center gap-2 px-4 py-2 bg-surface/50 border border-white/10 rounded-xl hover:bg-surface hover:border-white/20 transition-all duration-300 shadow-inner group active:scale-95 text-zinc-300 hover:text-white"
                            title="View Past Budgets"
                        >
                            <History className="w-4 h-4 text-zinc-500 group-hover:text-primary-light transition-colors" />
                            <span className="text-sm font-bold hidden md:block">Past Budgets</span>
                        </button>
                    </div>

                    {activeTerm ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary-light rounded-full text-sm font-medium border border-primary/20 shadow-[0_0_15px_rgba(79,140,255,0.1)]">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {formatDateDisplay(activeTerm.startDate)} – {formatDateDisplay(activeTerm.endDate)}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
                                <button
                                    onClick={onManageCategories}
                                    className="text-zinc-400 hover:text-white transition-all p-2.5 rounded-xl hover:bg-white/5 active:scale-95 flex items-center justify-center"
                                    title="Manage Categories"
                                >
                                    <Tags className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onManageTerms}
                                    className="text-zinc-400 hover:text-white transition-all p-2.5 rounded-xl hover:bg-white/5 active:scale-95 flex items-center justify-center"
                                    title="Manage Terms"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <button
                        onClick={onStartNew}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_4px_14px_rgba(79,140,255,0.39)] hover:shadow-[0_6px_20px_rgba(79,140,255,0.45)] hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span className="hidden sm:inline">Start Term</span>
                    </button>
                </div>

            </div>
        </header>
    );
}
