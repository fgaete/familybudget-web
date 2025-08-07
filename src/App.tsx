import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Welcome from './components/Welcome';
import Login from './components/Login';
import CategorySetup from './components/CategorySetup';
import BudgetSetup from './components/BudgetSetup';
import FinancialAnalysis from './components/FinancialAnalysis';
import PremiumModal from './components/PremiumModal';
import PremiumFeature from './components/PremiumFeature';
import AdminCleanup from './components/AdminCleanup';


// import { formatChileanPrice } from './services/liderScraper'; // Replaced by formatPrice from i18n
import { userService, UserData } from './services/userService';
import { useTranslations, formatPrice } from './utils/i18n';
import { Timestamp } from 'firebase/firestore';
import './App.css';

// Local interfaces for UI compatibility

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}



type TabType = 'budget' | 'analysis';

// Componente principal con autenticación
function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
        <PremiumModal />
      </SubscriptionProvider>
    </AuthProvider>
  );
}

// Componente de contenido principal
function AppContent() {
  const { currentUser, logout } = useAuth();
  const t = useTranslations();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCategorySetup, setShowCategorySetup] = useState(false);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Solo mostrar welcome si el usuario nunca la ha visto
    return !localStorage.getItem('hasSeenWelcome');
  });
  const [activeTab, setActiveTab] = useState<TabType>('budget');
  const [editingBudgetItem, setEditingBudgetItem] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showAdminCleanup, setShowAdminCleanup] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  // Función para acceder al panel de administración
  const handleAdminAccess = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    
    if (newCount >= 5) {
      setShowAdminCleanup(true);
      setAdminClickCount(0);
    }
  };

  // Estados locales para la interfaz
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Removed shoppingItems state as shopping functionality is eliminated
  const [monthlyBudget, setMonthlyBudget] = useState(0);


  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        let user = await userService.getUser(currentUser.uid);
        
        if (!user) {
          // Crear usuario nuevo
          await userService.createUser({
            uid: currentUser.uid,
            email: currentUser.email!,
            displayName: currentUser.displayName!,
            photoURL: currentUser.photoURL || undefined
          });
          user = await userService.getUser(currentUser.uid);
        }

        if (user) {
          setUserData(user);

          setTransactions(user.purchases?.map(p => ({
            id: p.id,
            description: p.name,
            amount: p.amount,
            category: p.category,
            date: p.date.toDate().toLocaleDateString('es-CL')
          })) || []);
          setMonthlyBudget(user.monthlyBudget);
          

          
          // Mostrar configuración de categorías si no están configuradas
          if (!user.categories || user.categories.length === 0) {
            setShowCategorySetup(true);
          } else if (user.monthlyBudget === 0) {
            // Mostrar configuración de presupuesto si no está configurado
            setShowBudgetSetup(true);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Si no hay usuario autenticado, mostrar welcome o login
  if (!currentUser) {
    if (showWelcome) {
      return <Welcome onGetStarted={() => {
        localStorage.setItem('hasSeenWelcome', 'true');
        setShowWelcome(false);
      }} />;
    }
    return <Login />;
  }

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  // Si necesita configurar categorías, mostrar setup de categorías
  if (showCategorySetup) {
    return (
      <CategorySetup 
        onComplete={async () => {
          setShowCategorySetup(false);
          // Recargar datos del usuario
          const user = await userService.getUser(currentUser.uid);
          if (user) {
            setUserData(user);
            // Verificar si necesita configurar presupuesto
            if (user.monthlyBudget === 0) {
              setShowBudgetSetup(true);
            }
          }
        }}
      />
    );
  }

  // Si necesita configurar presupuesto, mostrar setup
  if (showBudgetSetup) {
    return (
      <BudgetSetup 
        currentBudget={monthlyBudget}
        onComplete={async () => {
          setShowBudgetSetup(false);
          // Recargar datos del usuario
          const user = await userService.getUser(currentUser.uid);
          if (user) {
            setUserData(user);
            setMonthlyBudget(user.monthlyBudget);
            
            // Recargar transacciones desde Firestore
            setTransactions(user.purchases?.map(p => ({
              id: p.id,
              description: p.name,
              amount: p.amount,
              category: p.category,
              date: p.date.toDate().toLocaleDateString('es-CL')
            })) || []);
            

          }
        }}
      />
    );
  }





  const addTransaction = async (description: string, amount: number, category: string) => {
    if (!currentUser) return;
    
    // Importar la función de categorización inteligente
    const { detectCategory, learnFromUserSelection } = await import('./utils/smartCategorization');
    
    // Si no se seleccionó categoría, intentar detectarla automáticamente
    let finalCategory = category;
    if (!category || category === '') {
      const detectedCategory = detectCategory(description, userData?.categories || []);
      if (detectedCategory) {
        finalCategory = detectedCategory;
        console.log(`🤖 Categoría detectada automáticamente: "${description}" → ${detectedCategory}`);
      } else {
        finalCategory = 'Otros'; // Categoría por defecto
      }
    } else {
      // Si el usuario seleccionó manualmente una categoría, aprender de esa selección
      learnFromUserSelection(description, category);
    }
    
    const purchase = {
      id: Date.now().toString(),
      name: description,
      amount,
      category: finalCategory,
      date: Timestamp.now()
    };
    
    try {
      await userService.addPurchase(currentUser.uid, purchase);
      
      // Recargar datos del usuario para actualizar la interfaz
      const user = await userService.getUser(currentUser.uid);
      if (user) {
        setUserData(user);
        setTransactions(user.purchases?.map(p => ({
          id: p.id,
          description: p.name,
          amount: p.amount,
          category: p.category,
          date: p.date.toDate().toLocaleDateString('es-CL')
        })) || []);
      }
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(t.errorAddingTransaction);
    }
  };

  // Removed shopping-related functions as shopping functionality is eliminated



  // Función para actualizar el presupuesto mensual
  const updateMonthlyBudget = () => {
    setShowBudgetSetup(true);
  };

  // Función para agregar gastos fijos (créditos, servicios, etc.)
  const addBudgetItem = async (name: string, amount: number, category: 'credito' | 'servicios' | 'hipoteca' | 'otros') => {
    if (!currentUser) return;
    
    const budgetItem = {
      id: Date.now().toString(),
      name,
      amount,
      category,
      isRecurring: true
    };
    
    try {
      await userService.addBudgetItem(currentUser.uid, budgetItem);
      // Recargar datos del usuario para actualizar la interfaz
      const user = await userService.getUser(currentUser.uid);
      if (user) {
        setUserData(user);
        // Actualizar presupuesto restante

      }
    } catch (error) {
      console.error('Error adding budget item:', error);
      alert(t.errorAddingBudgetItem);
    }
  };

  // Función para editar gastos fijos
  const updateBudgetItem = async (updatedItem: any) => {
    if (!currentUser) return;
    
    try {
      await userService.updateBudgetItem(currentUser.uid, updatedItem);
      // Recargar datos del usuario
      const user = await userService.getUser(currentUser.uid);
      if (user) {
        setUserData(user);

      }
      setEditingBudgetItem(null);
    } catch (error) {
      console.error('Error updating budget item:', error);
      alert(t.errorUpdatingBudgetItem);
    }
  };

  // Función para eliminar gastos fijos
  const deleteBudgetItem = async (itemId: string) => {
    if (!currentUser) return;
    
    if (window.confirm(t.confirmDeleteBudgetItem)) {
      try {
        await userService.deleteBudgetItem(currentUser.uid, itemId);
        // Recargar datos del usuario
        const user = await userService.getUser(currentUser.uid);
        if (user) {
          setUserData(user);

        }
      } catch (error) {
        console.error('Error deleting budget item:', error);
        alert(t.errorDeletingBudgetItem);
      }
    }
  };

  // Función para editar transacciones/gastos variables
  const updateTransaction = async (updatedTransaction: any) => {
    if (!currentUser) return;
    
    try {
      // Convertir la transacción a formato Purchase para Firestore
      const purchase = {
        id: updatedTransaction.id,
        name: updatedTransaction.description,
        amount: updatedTransaction.amount,
        category: 'compras' as const,
        date: Timestamp.now()
      };
      
      await userService.updatePurchase(currentUser.uid, purchase);
      
      // Actualizar estado local
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      setTransactions(updatedTransactions);
      
      // Actualizar presupuesto restante
      
      
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
        alert(t.errorUpdatingTransaction);
    }
  };

  // Función para eliminar transacciones/gastos variables
  const deleteTransaction = async (transactionId: string) => {
    if (!currentUser) return;
    
    if (window.confirm(t.confirmDeleteTransaction)) {
      try {
        await userService.deletePurchase(currentUser.uid, transactionId);
        
        // Actualizar estado local
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        setTransactions(updatedTransactions);
        
      } catch (error) {
        console.error('Error deleting transaction:', error);
          alert(t.errorDeletingTransaction);
      }
    }
  };





  // Filter transactions by selected month
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
    const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
    return transactionMonth === selectedMonth;
  });

  const totalUsedBudget = (userData?.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0) + filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const budgetUsedPercentage = monthlyBudget > 0 ? (totalUsedBudget / monthlyBudget) * 100 : 0;

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <h1 
            onClick={handleAdminAccess}
            style={{ cursor: 'pointer' }}
            title={`Clics: ${adminClickCount}/5 para admin`}
          >
            💰 {t.appTitle}
          </h1>
        </div>
        <div className="header-center">
          <nav className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              {t.budgetTab}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              {t.analysisTab}
            </button>
          </nav>
        </div>
        <div className="header-right">
          <div className="user-info">
            {currentUser?.photoURL && (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="user-avatar"
              />
            )}
            <span className="user-name">{currentUser?.displayName}</span>
            <button className="logout-btn" onClick={logout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Month Selector */}
      <div className="month-selector-container">
        <div className="month-selector">
          <label htmlFor="month-select">📅 Seleccionar Mes:</label>
          <input
            id="month-select"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-input"
          />
        </div>
      </div>

      <main className="main-content">


        {activeTab === 'budget' && (
          <div className="tab-content">
            <h2>Presupuesto Personal</h2>
            <PremiumFeature className="summary-card" title="Resumen de Presupuesto Mensual">
              <h3>{t.monthlyBudget}</h3>
              <p>{t.monthlyBudget}: {formatPrice(monthlyBudget)}</p>
              <p>{t.usedBudget}: {formatPrice((userData?.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0) + filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0))}</p>
              <p>{t.remainingBudget}: {formatPrice(Math.max(0, monthlyBudget - (userData?.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0) - filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)))}</p>
              <div className="budget-bar">
                <div 
                  className="budget-progress" 
                  style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                ></div>
              </div>
            </PremiumFeature>

            <PremiumFeature className="add-form" title="Configuración de Presupuesto">
              <h3>Configurar Presupuesto Mensual</h3>
              <p>Este es tu presupuesto general para gastos variables (compras, menús, etc.)</p>
              <button 
                onClick={updateMonthlyBudget}
                className="setup-btn"
              >
                {t.setupBudget}
              </button>
            </PremiumFeature>

            <PremiumFeature className="add-form" title="Registro de Gastos Fijos">
              <h3>{t.fixedExpenses}</h3>
              <p>Registra aquí tus gastos básicos como servicios, hipoteca, créditos, etc.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                addBudgetItem(
                    formData.get('name') as string,
                    Number(formData.get('amount')),
                    formData.get('category') as 'credito' | 'servicios' | 'hipoteca' | 'otros'
                  );
                form.reset();
              }}>
                <input name="name" placeholder={t.expenseDescription} required />
                 <input name="amount" type="number" placeholder={t.monthlyAmount} required />
                 <select name="category" required>
                   <option value="">Seleccionar categoría</option>
                   <option value="servicios">Servicios Básicos</option>
                   <option value="hipoteca">Hipoteca/Arriendo</option>
                   <option value="credito">Créditos</option>
                   <option value="otros">Otros Fijos</option>
                 </select>
                <button type="submit">{t.addFixedExpense}</button>
              </form>
            </PremiumFeature>

            <div className="add-form">
              <h3>{t.variableExpenses}</h3>
              <p>Registra aquí gastos ocasionales. 🤖 <strong>¡Novedad!</strong> Si no seleccionas categoría, la detectaremos automáticamente según tu descripción.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                addTransaction(
                  formData.get('description') as string,
                  Number(formData.get('amount')),
                  formData.get('category') as string
                );
                form.reset();
              }}>
                <input name="description" placeholder="Ej: Almuerzo con amigos, Uber al trabajo, etc." required />
                <input name="amount" type="number" placeholder={t.amount} required />
                <select name="category">
                  <option value="">🤖 Detectar categoría automáticamente</option>
                  {userData?.categories && userData.categories.length > 0 ? (
                    userData.categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="Otros">Otros</option>
                  )}
                </select>
                <button type="submit">{t.addVariableExpense}</button>
              </form>
            </div>

            <PremiumFeature className="budget-section" title="Lista de Gastos Fijos">
              <h3>📋 Gastos Fijos Mensuales</h3>
              {userData?.budgetItems && userData.budgetItems.length > 0 ? (
                <>
                  <div className="items-list">
                    {userData.budgetItems.map(item => (
                       <div key={item.id} className="item-card budget-item">
                         <div className="item-content">
                           <h4>{item.name}</h4>
                           <p>Categoría: {item.category}</p>
                           <p>Monto: ${item.amount.toLocaleString('es-CL')}</p>
                         </div>
                         <div className="item-actions">
                           <button 
                             className="edit-btn"
                             onClick={() => setEditingBudgetItem(item)}
                             title="Editar gasto fijo"
                           >
                             ✏️
                           </button>
                           <button 
                             className="delete-btn"
                             onClick={() => deleteBudgetItem(item.id)}
                             title="Eliminar gasto fijo"
                           >
                             🗑️
                           </button>
                         </div>
                       </div>
                     ))}
                  </div>
                  <div className="budget-summary">
                    <p><strong>Total Gastos Fijos: ${userData.budgetItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString('es-CL')}</strong></p>
                  </div>
                </>
              ) : (
                <p>No hay gastos fijos registrados. Agrega algunos para comenzar.</p>
              )}
            </PremiumFeature>

            {transactions.length > 0 && (
              <div className="budget-section">
                <h3>💸 Gastos Variables</h3>
                <div className="items-list">
                  {filteredTransactions.map(transaction => (
                    <div key={transaction.id} className="item-card">
                      <div className="item-content">
                        <h4>{transaction.description}</h4>
                        <p>Categoría: {transaction.category}</p>
                        <p>Monto: ${transaction.amount.toLocaleString('es-CL')}</p>
                        <p>Fecha: {transaction.date}</p>
                      </div>
                      <div className="item-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => setEditingTransaction(transaction)}
                          title="Editar gasto"
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteTransaction(transaction.id)}
                          title="Eliminar gasto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="budget-summary">
                  <p><strong>Total Gastos Variables: ${filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0).toLocaleString('es-CL')}</strong></p>
                </div>
              </div>
            )}


          </div>
        )}

        {activeTab === 'analysis' && (
          <FinancialAnalysis
            monthlyBudget={monthlyBudget}
            fixedExpenses={userData?.budgetItems || []}
            variableExpenses={filteredTransactions}
          />
        )}

      </main>

      {/* Modal para editar gasto fijo */}
      {editingBudgetItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Gasto Fijo</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const updatedItem = {
                ...editingBudgetItem,
                name: formData.get('name') as string,
                amount: Number(formData.get('amount')),
                category: formData.get('category') as 'credito' | 'servicios' | 'hipoteca' | 'otros'
              };
              updateBudgetItem(updatedItem);
            }}>
              <input 
                name="name" 
                defaultValue={editingBudgetItem.name}
                placeholder="Descripción del gasto fijo" 
                required 
              />
              <input 
                name="amount" 
                type="number" 
                defaultValue={editingBudgetItem.amount}
                placeholder="Monto mensual" 
                required 
              />
              <select name="category" defaultValue={editingBudgetItem.category} required>
                <option value="servicios">Servicios Básicos</option>
                <option value="hipoteca">Hipoteca/Arriendo</option>
                <option value="credito">Créditos</option>
                <option value="otros">Otros Fijos</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingBudgetItem(null)}>Cancelar</button>
                <button type="submit">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar gasto variable */}
      {editingTransaction && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Gasto Variable</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const updatedTransaction = {
                ...editingTransaction,
                description: formData.get('description') as string,
                amount: Number(formData.get('amount')),
                category: formData.get('category') as string
              };
              updateTransaction(updatedTransaction);
            }}>
              <input 
                name="description" 
                defaultValue={editingTransaction.description}
                placeholder="Descripción del gasto" 
                required 
              />
              <input 
                name="amount" 
                type="number" 
                defaultValue={editingTransaction.amount}
                placeholder="Monto" 
                required 
              />
              <select name="category" defaultValue={editingTransaction.category} required>
                <option value="Alimentación">Alimentación</option>
                <option value="Transporte">Transporte</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Ropa">Ropa</option>
                <option value="Otros">Otros</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingTransaction(null)}>Cancelar</button>
                <button type="submit">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Cleanup Panel */}
      {showAdminCleanup && (
        <AdminCleanup onClose={() => setShowAdminCleanup(false)} />
      )}

    </div>
  );
}

export default App;
