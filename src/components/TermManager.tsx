import type { Term } from '../types';
import { formatDateDisplay } from '../utils/dateUtils';
import { Settings, Trash2, X, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TermManagerProps {
    terms: Term[];
    activeTermId: string | null;
    onClose: () => void;
    onSetActiveTerm: (id: string) => void;
    onDeleteTerm: (id: string) => void;
    onResetTerm: () => void;
}

export function TermManager({
    terms,
    activeTermId,
    onClose,
    onSetActiveTerm,
    onDeleteTerm,
    onResetTerm
}: TermManagerProps) {

    if (terms.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
            <div className="glass-card w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-slide-up bg-surface/90 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-surface/50">
                    <div className="flex items-center gap-3 text-white font-bold text-lg tracking-tight">
                        <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
                            <Settings className="w-5 h-5 text-primary-light" />
                        </div>
                        <h2>Manage Terms</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {activeTermId && (
                        <div className="mb-8 p-5 bg-orange-500/10 border border-orange-500/20 rounded-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-orange-500/5 blur-xl pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>
                            <h3 className="text-sm font-semibold text-orange-400 mb-3 uppercase tracking-wider relative z-10">Current Term Actions</h3>
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure? This will delete all expenses for the current term.")) {
                                        onResetTerm();
                                    }
                                }}
                                className="flex items-center justify-center gap-2 text-sm text-orange-300 bg-surface border border-orange-500/20 px-4 py-3 rounded-xl hover:bg-orange-500/20 hover:text-white transition-all w-full font-bold shadow-inner relative z-10 active:scale-[0.98]"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset Expenses
                            </button>
                        </div>
                    )}

                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">All Terms History</h3>
                    <div className="space-y-3">
                        {terms.map(term => {
                            const isActive = term.id === activeTermId;
                            return (
                                <div
                                    key={term.id}
                                    className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer
                                        ${isActive ? 'border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(79,140,255,0.1)]' : 'border-white/5 bg-surface-card hover:border-white/20 hover:bg-white-[0.05]'}`}
                                    onClick={() => onSetActiveTerm(term.id)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white text-sm tracking-tight">
                                                {formatDateDisplay(term.startDate)} - {formatDateDisplay(term.endDate)}
                                            </span>
                                            {isActive && (
                                                <span className="bg-primary/20 text-primary-light text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/20 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Active
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-zinc-400 font-medium">
                                            Budget: <span className="text-zinc-200">${term.budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm("Delete this term and all its expenses permanently?")) {
                                                onDeleteTerm(term.id);
                                            }
                                        }}
                                        className="p-2 text-zinc-500 hover:text-negative-light rounded-xl hover:bg-negative/20 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-negative/20 active:scale-95"
                                        title="Delete Term"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
