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
import { Timestamp } from 'firebase/firestore';
import './App.css';

// Función para formatear precios en pesos chilenos
const formatPrice = (amount: number): string => {
  return `$${amount.toLocaleString('es-CL')}`;
};

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
    // Estado para el mes seleccionado (mes actual)
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return currentMonth;
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

          setTransactions(user.purchases?.map(p => {
            const firebaseDate = p.date.toDate();
            // Usar formato YYYY-MM-DD para evitar confusión con DD-MM-YYYY
            const formattedDate = `${firebaseDate.getUTCFullYear()}-${String(firebaseDate.getUTCMonth() + 1).padStart(2, '0')}-${String(firebaseDate.getUTCDate()).padStart(2, '0')}`;
            console.log('📅 Fecha desde Firebase (loadUserData UTC):', firebaseDate.toISOString(), '→ Formateada:', formattedDate);
            return {
              id: p.id,
              description: p.name,
              amount: p.amount,
              category: p.category,
              date: formattedDate
            };
          }) || []);
          setMonthlyBudget(user.monthlyBudget);
          

          
          // Mostrar configuración de categorías si no están configuradas
          if (!user.categories || user.categories.length === 0) {
            setShowCategorySetup(true);
          }
          // El presupuesto ahora es opcional - no forzar su configuración
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
        <p>Cargando...</p>
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
            // El presupuesto es opcional - no forzar su configuración
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
            setTransactions(user.purchases?.map(p => {
              const firebaseDate = p.date.toDate();
              // Usar formato YYYY-MM-DD para evitar confusión con DD-MM-YYYY
              const formattedDate = `${firebaseDate.getUTCFullYear()}-${String(firebaseDate.getUTCMonth() + 1).padStart(2, '0')}-${String(firebaseDate.getUTCDate()).padStart(2, '0')}`;
              console.log('📅 Fecha desde Firebase (BudgetSetup UTC):', firebaseDate.toISOString(), '→ Formateada:', formattedDate);
              return {
                id: p.id,
                description: p.name,
                amount: p.amount,
                category: p.category,
                date: formattedDate
              };
            }) || []);
            

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
        console.log(`💰 Monto cargado: $${amount}`);
      } else {
        finalCategory = 'Otros'; // Categoría por defecto
      }
    } else {
      // Si el usuario seleccionó manualmente una categoría, aprender de esa selección
      learnFromUserSelection(description, category);
    }
    
    // Usar el mes seleccionado arriba para la fecha de la transacción
    const [year, month] = selectedMonth.split('-');
    // Usar UTC para evitar problemas de zona horaria
    const transactionDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 12, 0, 0)); // Día 1 del mes seleccionado a las 12:00 UTC
    console.log('📅 Fecha de transacción basada en mes seleccionado:', transactionDate, 'selectedMonth:', selectedMonth);
    console.log('📅 Año:', year, 'Mes:', month, 'Fecha UTC creada:', transactionDate.toISOString());
    
    const purchase = {
      id: Date.now().toString(),
      name: description,
      amount,
      category: finalCategory,
      date: Timestamp.fromDate(transactionDate)
    };
    
    console.log('📝 Nueva transacción creada:', purchase);
    
    try {
      await userService.addPurchase(currentUser.uid, purchase);
      
      // Recargar datos del usuario para actualizar la interfaz
      const user = await userService.getUser(currentUser.uid);
      if (user) {
        console.log('🔄 Datos del usuario recargados desde Firebase:', user.purchases?.length || 0, 'compras');
        console.log('🛒 Purchases desde Firebase:', user.purchases);
        setUserData(user);
        setTransactions(user.purchases?.map(p => {
          const firebaseDate = p.date.toDate();
          // Usar UTC para evitar problemas de zona horaria
          const formattedDate = `${firebaseDate.getUTCFullYear()}-${String(firebaseDate.getUTCMonth() + 1).padStart(2, '0')}-${String(firebaseDate.getUTCDate()).padStart(2, '0')}`;
          console.log('📅 Fecha desde Firebase (UTC):', firebaseDate.toISOString(), '→ Formateada:', formattedDate);
          return {
            id: p.id,
            description: p.name,
            amount: p.amount,
            category: p.category,
            date: formattedDate
          };
        }) || []);
      }
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error al agregar la transacción');
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
      alert('Error al agregar el gasto fijo');
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
      alert('Error al actualizar el gasto fijo');
    }
  };

  // Función para eliminar gastos fijos
  const deleteBudgetItem = async (itemId: string) => {
    if (!currentUser) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto fijo?')) {
      try {
        await userService.deleteBudgetItem(currentUser.uid, itemId);
        // Recargar datos del usuario
        const user = await userService.getUser(currentUser.uid);
        if (user) {
          setUserData(user);

        }
      } catch (error) {
        console.error('Error deleting budget item:', error);
        alert('Error al eliminar el gasto fijo');
      }
    }
  };

  // Función para editar transacciones/gastos variables
  const updateTransaction = async (updatedTransaction: any) => {
    if (!currentUser) return;
    
    try {
      // Usar el mes seleccionado arriba para la fecha de la transacción editada
      const [year, month] = selectedMonth.split('-');
      // Usar UTC para evitar problemas de zona horaria
      const transactionDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 12, 0, 0)); // Día 1 del mes seleccionado a las 12:00 UTC
      console.log('📅 Fecha de transacción editada basada en mes seleccionado:', transactionDate, 'selectedMonth:', selectedMonth);
      console.log('📅 Año:', year, 'Mes:', month, 'Fecha UTC editada:', transactionDate.toISOString());
      
      // Convertir la transacción a formato Purchase para Firestore
      const purchase = {
        id: updatedTransaction.id,
        name: updatedTransaction.description,
        amount: updatedTransaction.amount,
        category: updatedTransaction.category, // Usar la categoría actualizada
        date: Timestamp.fromDate(transactionDate)
      };
      
      await userService.updatePurchase(currentUser.uid, purchase);
      
      // Recargar datos del usuario para actualizar la interfaz
      const user = await userService.getUser(currentUser.uid);
      if (user) {
        setUserData(user);
        setTransactions(user.purchases?.map(p => {
          const firebaseDate = p.date.toDate();
          // Usar formato YYYY-MM-DD para evitar confusión con DD-MM-YYYY
          const formattedDate = `${firebaseDate.getUTCFullYear()}-${String(firebaseDate.getUTCMonth() + 1).padStart(2, '0')}-${String(firebaseDate.getUTCDate()).padStart(2, '0')}`;
          console.log('📅 Fecha desde Firebase (update UTC):', firebaseDate.toISOString(), '→ Formateada:', formattedDate);
          return {
            id: p.id,
            description: p.name,
            amount: p.amount,
            category: p.category,
            date: formattedDate
          };
        }) || []);
      }
      
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
        alert('Error al actualizar el gasto');
    }
  };

  // Función para eliminar transacciones/gastos variables
  const deleteTransaction = async (transactionId: string) => {
    if (!currentUser) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      try {
        await userService.deletePurchase(currentUser.uid, transactionId);
        
        // Actualizar estado local
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        setTransactions(updatedTransactions);
        
      } catch (error) {
        console.error('Error deleting transaction:', error);
          alert('Error al eliminar el gasto');
      }
    }
  };





  // Filter transactions by selected month
  console.log('🔍 Filtrando transacciones:');
  console.log('📅 selectedMonth:', selectedMonth);
  console.log('📋 transactions antes del filtro:', transactions);
  
  const filteredTransactions = transactions.filter(transaction => {
    console.log('🔎 Procesando transacción:', transaction);
    try {
      // Handle Chilean date format DD/MM/YYYY
      let transactionDate;
      if (transaction.date.includes('/')) {
        const parts = transaction.date.split('/');
        console.log('📅 Partes de fecha:', parts);
        if (parts.length === 3) {
          // Convert DD/MM/YYYY to YYYY-MM-DD for proper Date parsing
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          transactionDate = new Date(`${year}-${month}-${day}`);
          console.log('📅 Fecha convertida:', transactionDate);
        } else {
          transactionDate = new Date(transaction.date);
        }
      } else {
        transactionDate = new Date(transaction.date);
      }
      
      // Check if date is valid
      if (isNaN(transactionDate.getTime())) {
        console.warn('❌ Invalid date format:', transaction.date);
        return false;
      }
      
      const transactionMonth = `${transactionDate.getUTCFullYear()}-${String(transactionDate.getUTCMonth() + 1).padStart(2, '0')}`;
      console.log('📅 transactionMonth calculado (UTC):', transactionMonth, 'vs selectedMonth:', selectedMonth);
      const matches = transactionMonth === selectedMonth;
      console.log('✅ Coincide:', matches);
      return matches;
    } catch (error) {
      console.error('❌ Error filtering transaction:', error, transaction);
      return false;
    }
  });
  
  console.log('✅ Transacciones filtradas:', filteredTransactions);

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
            💰 GastosInteligentes
          </h1>
        </div>
        <div className="header-center">
          <nav className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              📊 Presupuesto
            </button>
            <button 
              className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              📈 Análisis
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
              <h3>Presupuesto Mensual</h3>
              <p>Presupuesto Mensual: {formatPrice(monthlyBudget)}</p>
              <p>Presupuesto Usado: {formatPrice((userData?.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0) + filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0))}</p>
              <p>Presupuesto Restante: {formatPrice(Math.max(0, monthlyBudget - (userData?.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0) - filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)))}</p>
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
                Configurar Presupuesto
              </button>
            </PremiumFeature>

            <PremiumFeature className="add-form" title="Registro de Gastos Fijos">
              <h3>Gastos Fijos Mensuales</h3>
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
                <input name="name" placeholder="Descripción del gasto" required />
                 <input name="amount" type="number" placeholder="Monto mensual" required />
                 <select name="category" required>
                   <option value="">Seleccionar categoría</option>
                   <option value="servicios">Servicios Básicos</option>
                   <option value="hipoteca">Hipoteca/Arriendo</option>
                   <option value="credito">Créditos</option>
                   <option value="otros">Otros Fijos</option>
                 </select>
                <button type="submit">Agregar Gasto Fijo</button>
              </form>
            </PremiumFeature>

            <div className="add-form">
              <h3>Gastos Variables</h3>
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
                <input name="amount" type="number" placeholder="Monto" required />
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
                <button type="submit">Agregar Gasto Variable</button>
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
          <>
            {/* Debug logs para FinancialAnalysis */}
            {console.log('🚀 App.tsx - Pasando datos a FinancialAnalysis:')}
            {console.log('📊 monthlyBudget:', monthlyBudget)}
            {console.log('🏠 fixedExpenses (budgetItems):', userData?.budgetItems || [])}
            {console.log('💸 filteredTransactions:', filteredTransactions)}
            {console.log('📝 filteredTransactions length:', filteredTransactions.length)}
            {console.log('🔢 Total filteredTransactions amount:', filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
            <FinancialAnalysis
              monthlyBudget={monthlyBudget}
              fixedExpenses={userData?.budgetItems || []}
              variableExpenses={filteredTransactions}
              allTransactions={transactions}
            />
          </>
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
