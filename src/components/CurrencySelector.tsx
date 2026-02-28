import { useState, useRef, useEffect } from 'react';
import { SUPPORTED_CURRENCIES, CURRENCY_CODES } from '../utils/currencyUtils';
import { ChevronDown, Check } from 'lucide-react';

interface CurrencySelectorProps {
    value: string;
    onChange: (code: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentCurrency = SUPPORTED_CURRENCIES[value] || SUPPORTED_CURRENCIES['USD'];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-surface/50 border border-white/10 rounded-xl hover:bg-surface hover:border-white/20 transition-all duration-300 shadow-inner group active:scale-95"
            >
                <span className="text-lg leading-none">{currentCurrency.flag}</span>
                <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {currentCurrency.code}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute right-0 mt-2 w-56 glass-card bg-surface/90 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden origin-top-right transition-all duration-300
                ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {CURRENCY_CODES.map(code => {
                        const currency = SUPPORTED_CURRENCIES[code];
                        const isSelected = code === value;
                        return (
                            <button
                                key={code}
                                onClick={() => {
                                    onChange(code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left
                                    ${isSelected ? 'bg-primary/20 text-primary-light border-primary/30 border' : 'hover:bg-white/5 text-zinc-300 border border-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg leading-none">{currency.flag}</span>
                                    <div>
                                        <div className="font-bold text-sm tracking-wide">{code} <span className="text-zinc-500 font-normal ml-1">({currency.symbol})</span></div>
                                        <div className="text-[10px] text-zinc-500 tracking-wider uppercase truncate max-w-[100px]">{currency.name}</div>
                                    </div>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-primary" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
