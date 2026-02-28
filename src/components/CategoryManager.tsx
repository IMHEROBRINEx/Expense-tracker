import { useState } from 'react';
import type { Category } from '../types';
import { Tag, X, Plus, Trash2, Edit2, Check } from 'lucide-react';

interface CategoryManagerProps {
    categories: Category[];
    onClose: () => void;
    onAddCategory: (name: string) => void;
    onDeleteCategory: (id: string) => void;
    onUpdateCategory: (id: string, name: string) => void;
}

export function CategoryManager({
    categories,
    onClose,
    onAddCategory,
    onDeleteCategory,
    onUpdateCategory
}: CategoryManagerProps) {
    const [newCatName, setNewCatName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        onAddCategory(newCatName.trim());
        setNewCatName('');
    };

    const handleSaveEdit = (id: string) => {
        if (!editName.trim()) return;
        onUpdateCategory(id, editName.trim());
        setEditingId(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
            <div className="glass-card w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-slide-up bg-surface/90 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-surface/50">
                    <div className="flex items-center gap-3 text-white font-bold text-lg tracking-tight">
                        <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
                            <Tag className="w-5 h-5 text-primary-light" />
                        </div>
                        <h2>Manage Categories</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Add New Category Form */}
                    <form onSubmit={handleAdd} className="mb-8">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Create Custom Category</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                required
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                placeholder="e.g. Subscriptions"
                                className="flex-1 px-4 py-3 bg-surface border border-white/10 rounded-xl focus:bg-surface-card focus:ring-1 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm text-white placeholder-zinc-600 shadow-inner"
                            />
                            <button
                                type="submit"
                                className="px-5 py-3 bg-primary/20 text-primary-light border border-primary/30 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(79,140,255,0.1)] active:scale-95 text-sm"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    </form>

                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Your Categories</h3>
                    <div className="space-y-3">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className="p-3.5 rounded-xl border border-white/5 bg-surface-card flex items-center justify-between group hover:border-white/10 transition-colors"
                            >
                                {editingId === category.id ? (
                                    <div className="flex-1 flex items-center gap-2 mr-2">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 px-3 py-2 text-sm bg-surface border border-primary/50 rounded-lg outline-none text-white focus:ring-1 focus:ring-primary shadow-inner"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveEdit(category.id);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                        />
                                        <button
                                            onClick={() => handleSaveEdit(category.id)}
                                            className="p-2 bg-positive/20 text-positive border border-positive/30 rounded-lg hover:bg-positive hover:text-white transition-colors"
                                            title="Save"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="p-2 bg-surface border border-white/10 text-zinc-400 rounded-lg hover:text-white hover:border-white/30 transition-colors"
                                            title="Cancel"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-zinc-200 text-sm tracking-wide">
                                                {category.name}
                                            </span>
                                            {category.isDefault && (
                                                <span className="text-[9px] font-bold tracking-widest text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full uppercase border border-white/5">
                                                    Default
                                                </span>
                                            )}
                                        </div>

                                        {!category.isDefault && (
                                            <div className="flex gap-2 bg-surface rounded-lg p-1 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(category.id);
                                                        setEditName(category.name);
                                                    }}
                                                    className="p-1.5 text-zinc-500 hover:text-primary-light rounded-md hover:bg-primary/20 transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <div className="w-px h-6 bg-white/10 self-center"></div>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
                                                            onDeleteCategory(category.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-zinc-500 hover:text-negative-light rounded-md hover:bg-negative/20 transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
