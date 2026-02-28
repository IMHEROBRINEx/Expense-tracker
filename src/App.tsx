import { useState } from 'react';
import { useExpenseTracker } from './hooks/useExpenseTracker';
import { Header } from './components/Header';
import { TermSetup } from './components/TermSetup';
import { TermManager } from './components/TermManager';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { CategoryManager } from './components/CategoryManager';

function App() {
  const {
    terms,
    activeTerm,
    activeTermId,
    activeTermExpenses,
    categories,
    setActiveTermId,
    startNewTerm,
    deleteTerm,
    resetCurrentTerm,
    deleteExpense,
    addCategory,
    deleteCategory,
    updateCategory
  } = useExpenseTracker();

  const [showTermSetup, setShowTermSetup] = useState(false);
  const [showTermManager, setShowTermManager] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const handleStartNewTerm = (startDate: string, budget: number) => {
    startNewTerm(startDate, budget);
    setShowTermSetup(false);
  };

  const isInitialSetup = !activeTerm && !showTermSetup && terms.length === 0;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header
        activeTerm={activeTerm}
        onStartNew={() => setShowTermSetup(true)}
        onManageTerms={() => setShowTermManager(true)}
        onManageCategories={() => setShowCategoryManager(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isInitialSetup || showTermSetup ? (
          <TermSetup
            onStart={handleStartNewTerm}
            onCancel={activeTerm ? () => setShowTermSetup(false) : undefined}
            isInitial={isInitialSetup}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <ExpenseForm />
              <ExpenseList
                expenses={activeTermExpenses}
                categories={categories}
                onDelete={deleteExpense}
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
    </div>
  );
}

export default App;
