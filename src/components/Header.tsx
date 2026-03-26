import { useState } from 'react';
import type { Term } from '../types';
import { PlusCircle, Settings, Wallet, Tags, History, Menu, X } from 'lucide-react';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-surface/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/5 sticky top-0 z-40 px-0 sm:px-6 shrink-0 w-full pt-[env(safe-area-inset-top)] pb-0">
            <div className="max-w-6xl mx-auto flex flex-col relative w-full">
                <div className="flex flex-row flex-nowrap items-center justify-between gap-2 w-full h-14 sm:h-12 px-4 sm:px-0">
                    
                    {/* Logo / App Name */}
                    <div className="flex flex-row items-center gap-2 text-primary shrink-0 min-w-0">
                        <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 shrink-0">
                            <Wallet className="w-5 h-5 sm:w-4 sm:h-4 text-primary" />
                        </div>
                        <span className="text-base sm:text-sm font-bold tracking-tight text-white whitespace-nowrap">
                            Expense Tracker
                        </span>
                    </div>

                    {/* Action Icons */}
                    <div className="flex flex-row items-center justify-end flex-1 gap-2 shrink-0">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-xl transition-all shrink-0 ${isMenuOpen ? 'text-white bg-white/10' : 'text-zinc-300 bg-white/5'} active:scale-95`}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 sm:left-auto sm:right-4 right-0 w-full sm:w-80 sm:mt-2 sm:rounded-2xl sm:border sm:border-white/10 bg-surface/95 backdrop-blur-xl border-b border-white/5 p-4 flex flex-col gap-2 shadow-2xl z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                        <button 
                            onClick={() => { onStartNew(); setIsMenuOpen(false); }} 
                            className="flex items-center gap-3 w-full p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.98] transition-all text-left border border-primary/20"
                        >
                            <div className="bg-primary p-2 rounded-lg">
                                <PlusCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-sm">Start New Term</span>
                        </button>

                        <div className="h-px bg-white/5 my-1" />

                        <div className="flex items-center justify-between px-3 py-2">
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Currency</span>
                            <div className="z-50 relative">
                                <CurrencySelector value={globalCurrency} onChange={onUpdateCurrency} />
                            </div>
                        </div>
                        
                        <div className="h-px bg-white/5 my-1" />
                        
                        <button onClick={() => { onOpenPastBudgets(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-white active:scale-[0.98] transition-all text-left">
                            <div className="bg-white/5 p-2 rounded-lg">
                                <History className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm">Past Budgets</span>
                        </button>
                        
                        {activeTerm && (
                            <>
                                <button onClick={() => { onManageCategories(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-white active:scale-[0.98] transition-all text-left">
                                    <div className="bg-white/5 p-2 rounded-lg">
                                        <Tags className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-sm">Manage Categories</span>
                                </button>
                                <button onClick={() => { onManageTerms(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-white active:scale-[0.98] transition-all text-left">
                                    <div className="bg-white/5 p-2 rounded-lg">
                                        <Settings className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-sm">Manage Terms</span>
                                </button>
                            </>
                        )}

                        <div className="h-px bg-white/5 my-1 sm:hidden" />

                        <a 
                            href="https://docs.google.com/forms/d/e/1FAIpQLSddxPs-pf6RIicSDYOHUumbcB2_H7jqotIUPxSsA17jKJt5_w/viewform?usp=publish-editor" 
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="sm:hidden flex items-center gap-3 w-full p-3 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 active:scale-[0.98] transition-all text-left border border-amber-500/20"
                        >
                            <div className="bg-amber-500/20 flex items-center justify-center w-8 h-8 rounded-lg shrink-0">
                                <span className="text-base leading-none">🐛</span>
                            </div>
                            <span className="font-bold text-sm">Report a bug</span>
                        </a>

                        <a 
                            href="https://github.com/IMHEROBRINEx/Expense-tracker" 
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="sm:hidden flex items-center gap-3 w-full p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-[0.98] transition-all text-left border border-rose-500/20"
                        >
                            <div className="bg-rose-500/20 flex items-center justify-center w-8 h-8 rounded-lg shrink-0">
                                <span className="text-base leading-none">❤️</span>
                            </div>
                            <span className="font-bold text-sm">Contribute</span>
                        </a>
                    </div>
                )}
            </div>
        </header>
    );
}
