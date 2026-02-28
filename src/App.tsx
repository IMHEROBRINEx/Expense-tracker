import { useState } from 'react';
import { useExpenseTracker } from './hooks/useExpenseTracker';
import { SUPPORTED_CURRENCIES } from './utils/currencyUtils';
import { Header } from './components/Header';
import { TermSetup } from './components/TermSetup';
import { TermManager } from './components/TermManager';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { CategoryManager } from './components/CategoryManager';
import { PastBudgets } from './components/PastBudgets';

function App() {
  const {
    globalCurrency,
    terms,
    activeTerm,
    activeTermId,
    expenses,
    activeTermExpenses,
    categories,
    setGlobalCurrency,
    setActiveTermId,
    startNewTerm,
    updateTermCurrency,
    deleteTerm,
    resetCurrentTerm,
    endCurrentTerm,
    deleteExpense,
    addCategory,
    deleteCategory,
    updateCategory
  } = useExpenseTracker();

  const [showTermSetup, setShowTermSetup] = useState(false);
  const [showTermManager, setShowTermManager] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showPastBudgets, setShowPastBudgets] = useState(false);

  const handleStartNewTerm = (startDate: string, budget: number) => {
    startNewTerm(startDate, budget);
    setShowTermSetup(false);
  };

  const handleUpdateCurrency = (code: string) => {
    setGlobalCurrency(code);
    if (activeTermId) {
      updateTermCurrency(activeTermId, code);
    }
  };

  const isInitialSetup = !activeTerm && !showTermSetup && terms.length === 0;

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-zinc-100 overflow-x-hidden relative">
      <Header
        activeTerm={activeTerm}
        globalCurrency={globalCurrency}
        onUpdateCurrency={handleUpdateCurrency}
        onStartNew={() => setShowTermSetup(true)}
        onManageTerms={() => setShowTermManager(true)}
        onManageCategories={() => setShowCategoryManager(true)}
        onOpenPastBudgets={() => setShowPastBudgets(true)}
        onEndTerm={endCurrentTerm}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative z-0">
        {isInitialSetup || showTermSetup ? (
          <div className="animate-slide-up">
            <TermSetup
              onStart={handleStartNewTerm}
              onCancel={activeTerm ? () => setShowTermSetup(false) : undefined}
              isInitial={isInitialSetup}
              activeCurrencySymbol={SUPPORTED_CURRENCIES[globalCurrency]?.symbol || '$'}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <ExpenseForm />
              <ExpenseList
                expenses={activeTermExpenses}
                categories={categories}
                onDelete={deleteExpense}
                activeCurrency={activeTerm?.currency || globalCurrency}
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              {activeTerm && (
                <Dashboard
                  term={activeTerm}
                  expenses={activeTermExpenses}
                  categories={categories}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {showTermManager && (
        <TermManager
          terms={terms}
          activeTermId={activeTermId}
          onClose={() => setShowTermManager(false)}
          onSetActiveTerm={setActiveTermId}
          onDeleteTerm={deleteTerm}
          onResetTerm={resetCurrentTerm}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onClose={() => setShowCategoryManager(false)}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onUpdateCategory={updateCategory}
        />
      )}

      {showPastBudgets && (
        <PastBudgets
          terms={terms}
          expenses={expenses}
          categories={categories}
          activeTerm={activeTerm}
          onClose={() => setShowPastBudgets(false)}
        />
      )}
    </div>
  );
}

export default App;
