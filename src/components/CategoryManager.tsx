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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <Tag className="w-5 h-5 text-primary" />
                        <h2>Manage Categories</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <form onSubmit={handleAdd} className="mb-6 flex gap-2">
                        <input
                            type="text"
                            required
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            placeholder="New category name..."
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                        />
                        <button
                            type="submit"
                            className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-1 shadow-sm font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </form>

                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Categories</h3>
                    <div className="space-y-2">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between group"
                            >
                                {editingId === category.id ? (
                                    <div className="flex-1 flex gap-2 mr-2">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 px-2 py-1 text-sm border border-primary rounded outline-none"
                                        />
                                        <button onClick={() => handleSaveEdit(category.id)} className="text-emerald-600 hover:text-emerald-700">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-800 text-sm">
                                                {category.name}
                                            </span>
                                            {category.isDefault && (
                                                <span className="text-[10px] font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                                                    Default
                                                </span>
                                            )}
                                        </div>

                                        {!category.isDefault && (
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(category.id);
                                                        setEditName(category.name);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Delete category "${category.name}"?`)) {
                                                            onDeleteCategory(category.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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
