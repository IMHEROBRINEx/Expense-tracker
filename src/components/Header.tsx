import type { Term } from '../types';
import { formatDateDisplay } from '../utils/dateUtils';
import { Calendar, PlusCircle, Settings, Wallet, Tags } from 'lucide-react';

interface HeaderProps {
    activeTerm: Term | null;
    onStartNew: () => void;
    onManageTerms: () => void;
    onManageCategories: () => void;
}

export function Header({ activeTerm, onStartNew, onManageTerms, onManageCategories }: HeaderProps) {
    return (
        <header className="bg-surface shadow-sm border-b border-slate-200 sticky top-0 z-10 py-4 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                {/* Logo / App Name */}
                <div className="flex items-center gap-2 text-primary">
                    <Wallet className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Monthly Budget Tracker</h1>
                </div>

                {/* Active Term Display & Actions */}
                <div className="flex items-center gap-3">
                    {activeTerm ? (
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-primary-dark rounded-full text-sm font-medium border border-blue-100 mr-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {formatDateDisplay(activeTerm.startDate)} – {formatDateDisplay(activeTerm.endDate)}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 border-r border-slate-200 pr-3 mr-1">
                                <button
                                    onClick={onManageCategories}
                                    className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100 flex items-center justify-center"
                                    title="Manage Categories"
                                >
                                    <Tags className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onManageTerms}
                                    className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100 flex items-center justify-center"
                                    title="Manage Terms"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <button
                        onClick={onStartNew}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span className="hidden sm:inline">Start New Term</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>

            </div>
        </header>
    );
}
