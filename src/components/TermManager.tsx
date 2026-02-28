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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <Settings className="w-5 h-5 text-primary" />
                        <h2>Manage Terms</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {activeTermId && (
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                            <h3 className="text-sm font-semibold text-orange-800 mb-2">Current Term Actions</h3>
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure? This will delete all expenses for the current term.")) {
                                        onResetTerm();
                                    }
                                }}
                                className="flex items-center gap-2 text-sm text-orange-700 bg-white px-3 py-1.5 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors w-full justify-center font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset Expenses for Current Term
                            </button>
                        </div>
                    )}

                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">All Terms History</h3>
                    <div className="space-y-3">
                        {terms.map(term => {
                            const isActive = term.id === activeTermId;
                            return (
                                <div
                                    key={term.id}
                                    className={`p-4 rounded-xl border ${isActive ? 'border-primary bg-blue-50/50' : 'border-slate-200 bg-white'} flex items-center justify-between group`}
                                >
                                    <div className="flex-1 cursor-pointer" onClick={() => onSetActiveTerm(term.id)}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-slate-800 text-sm">
                                                {formatDateDisplay(term.startDate)} - {formatDateDisplay(term.endDate)}
                                            </span>
                                            {isActive && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Budget: ${term.budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (window.confirm("Delete this term and all its expenses permanently?")) {
                                                onDeleteTerm(term.id);
                                            }
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
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
