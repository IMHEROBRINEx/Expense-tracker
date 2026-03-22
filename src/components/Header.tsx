import type { Term } from '../types';
import { PlusCircle, Settings, Wallet, Tags, History } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';

interface HeaderProps {
    activeTerm: Term | null;
    globalCurrency: string;
    onUpdateCurrency: (currency: string) => void;
    onStartNew: () => void;
    onManageTerms: () => void;
    onManageCategories: () => void;
    onOpenPastBudgets: () => void;
    onEndTerm: () => void;
}

export function Header({
    activeTerm,
    globalCurrency,
    onUpdateCurrency,
    onStartNew,
    onManageTerms,
    onManageCategories,
    onOpenPastBudgets,
}: HeaderProps) {
    return (
        <header className="bg-surface/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/5 sticky top-0 z-40 px-4 sm:px-6 shrink-0 w-full overflow-visible pt-[env(safe-area-inset-top)] pb-0">
            <div className="max-w-6xl mx-auto flex flex-row flex-nowrap items-center justify-between gap-2 w-full h-12">

                {/* Logo / App Name */}
                <div className="flex flex-row items-center gap-2 text-primary shrink-0 min-w-0">
                    <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 shrink-0">
                        <Wallet className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-white whitespace-nowrap">
                        Expense Tracker
                    </span>
                </div>

                {/* Action Icons */}
                <div className="flex flex-row flex-nowrap items-center justify-end gap-1 flex-1 min-w-0">

                    {/* Scrollable middle actions */}
                    <div className="flex flex-row flex-nowrap items-center justify-end gap-1 overflow-x-auto no-scrollbar shrink">
                        {/* Past Budgets */}
                        <button
                            onClick={onOpenPastBudgets}
                            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all shrink-0"
                            title="Past Budgets"
                        >
                            <History className="w-4 h-4" />
                        </button>

                        {activeTerm && (
                            <>
                                {/* Manage Categories */}
                                <button
                                    onClick={onManageCategories}
                                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all shrink-0"
                                    title="Manage Categories"
                                >
                                    <Tags className="w-4 h-4" />
                                </button>

                                {/* Manage Terms */}
                                <button
                                    onClick={onManageTerms}
                                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all shrink-0"
                                    title="Manage Terms"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Pinned essential actions (Not scrollable) */}
                    <div className="flex flex-row items-center gap-1 shrink-0 relative">
                        {/* Currency Selector */}
                        <CurrencySelector
                            value={globalCurrency}
                            onChange={onUpdateCurrency}
                        />

                        {/* Start / New Term */}
                        <button
                            onClick={onStartNew}
                            className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-xl font-medium transition-all shadow-[0_4px_14px_rgba(79,140,255,0.39)] active:scale-95 whitespace-nowrap shrink-0 text-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Start Term</span>
                        </button>
                    </div>
                </div>

            </div>
        </header>
    );
}
