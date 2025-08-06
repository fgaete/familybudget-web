import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import BudgetSetup from './components/BudgetSetup';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

import { formatChileanPrice } from './services/liderScraper';
import { userService, UserData } from './services/userService';
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

// Removed ShoppingItem interface as shopping functionality is eliminated

type TabType = 'budget';

// Componente principal con autenticación
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Componente de contenido principal
function AppContent() {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('budget');
  const [editingBudgetItem, setEditingBudgetItem] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);


  // Estados locales para la interfaz
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Removed shoppingItems state as shopping functionality is eliminated
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

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
          
          const remaining = await userService.getRemainingBudget(currentUser.uid);
          setRemainingBudget(remaining);
          
          // Mostrar configuración de presupuesto si no está configurado
          if (user.monthlyBudget === 0) {
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

  // Si no hay usuario autenticado, mostrar login
  if (!currentUser) {
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
            
            const remaining = await userService.getRemainingBudget(currentUser.uid);
            setRemainingBudget(remaining);
          }
        }}
      />
    );
  }





  const addTransaction = async (description: string, amount: number, category: string) => {
    if (!currentUser) return;
    
    const purchase = {
      id: Date.now().toString(),
      name: description,
      amount,
      category: 'compras' as const,
      date: Timestamp.now()
    };
    
    try {
      await userService.addPurchase(currentUser.uid, purchase);
      
      // Actualizar estado local
      const newTransaction: Transaction = {
        id: purchase.id,
        description,
        amount,
        category,
        date: new Date().toLocaleDateString('es-CL')
      };
      setTransactions([...transactions, newTransaction]);
      
      // Actualizar presupuesto restante
      const remaining = await userService.getRemainingBudget(currentUser.uid);
      setRemainingBudget(remaining);
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error al agregar la transacción');
    }
  };

  // Removed shopping-related functions as shopping functionality is eliminated

  // Functions to generate chart data
  const getBudgetOverviewData = () => {
    const fixedExpenses = userData?.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const variableExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const remaining = remainingBudget;
    
    return [
      { name: 'Gastos Fijos', value: fixedExpenses, color: '#FF6B6B' },
      { name: 'Gastos Variables', value: variableExpenses, color: '#4ECDC4' },
      { name: 'Presupuesto Restante', value: remaining, color: '#45B7D1' }
    ];
  };

  const getFixedExpensesData = () => {
    if (!userData?.budgetItems) return [];
    
    const categoryTotals: { [key: string]: number } = {};
    userData.budgetItems.forEach(item => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
      color: colors[index % colors.length]
    }));
  };

  const getVariableExpensesData = () => {
    const categoryTotals: { [key: string]: number } = {};
    transactions.forEach(transaction => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });
    
    const colors = ['#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: colors[index % colors.length]
    }));
  };

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
        const remaining = await userService.getRemainingBudget(currentUser.uid);
        setRemainingBudget(remaining);
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
        const remaining = await userService.getRemainingBudget(currentUser.uid);
        setRemainingBudget(remaining);
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
          const remaining = await userService.getRemainingBudget(currentUser.uid);
          setRemainingBudget(remaining);
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
      const remaining = await userService.getRemainingBudget(currentUser.uid);
      setRemainingBudget(remaining);
      
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
        
        // Actualizar presupuesto restante
        const remaining = await userService.getRemainingBudget(currentUser.uid);
        setRemainingBudget(remaining);
        
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Error al eliminar el gasto');
      }
    }
  };

  // Removed totalShopping calculation as shopping functionality is eliminated
  const budgetUsedPercentage = monthlyBudget > 0 ? ((monthlyBudget - remainingBudget) / monthlyBudget) * 100 : 0;

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <h1>🏠 Family Order App</h1>
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
            <div className="budget-indicator">
              <span className="budget-text">
                {formatChileanPrice(remainingBudget)} / {formatChileanPrice(monthlyBudget)}
              </span>
              <div className="budget-bar">
                <div 
                  className="budget-fill" 
                  style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
        {/* Removed tab navigation as shopping functionality is eliminated */}
      </header>

      <main className="main-content">


        {activeTab === 'budget' && (
          <div className="tab-content">
            <h2>Presupuesto Familiar</h2>
            <div className="summary-card">
              <h3>Resumen Mensual</h3>
              <p>Presupuesto: ${monthlyBudget.toLocaleString('es-CL')}</p>
              <p>Gastado: ${(monthlyBudget - remainingBudget).toLocaleString('es-CL')}</p>
              <p>Restante: ${remainingBudget.toLocaleString('es-CL')}</p>
              <div className="budget-bar">
                <div 
                  className="budget-progress" 
                  style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="add-form">
              <h3>Configurar Presupuesto Mensual</h3>
              <p>Este es tu presupuesto general para gastos variables (compras, menús, etc.)</p>
              <button 
                onClick={updateMonthlyBudget}
                className="setup-btn"
              >
                Actualizar Presupuesto Mensual
              </button>
            </div>

            <div className="add-form">
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
                <input name="name" placeholder="Descripción del gasto fijo" required />
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
            </div>

            <div className="add-form">
              <h3>Gastos Variables</h3>
              <p>Registra aquí gastos ocasionales que no están incluidos en compras o menús</p>
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
                <input name="description" placeholder="Descripción del gasto" required />
                <input name="amount" type="number" placeholder="Monto" required />
                <select name="category" required>
                  <option value="">Seleccionar categoría</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Entretenimiento">Entretenimiento</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Otros">Otros</option>
                </select>
                <button type="submit">Agregar Gasto</button>
              </form>
            </div>

            {userData?.budgetItems && userData.budgetItems.length > 0 && (
              <div className="budget-section">
                <h3>📋 Gastos Fijos Mensuales</h3>
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
              </div>
            )}

            {transactions.length > 0 && (
              <div className="budget-section">
                <h3>💸 Gastos Variables</h3>
                <div className="items-list">
                  {transactions.map(transaction => (
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
                  <p><strong>Total Gastos Variables: ${transactions.reduce((sum, transaction) => sum + transaction.amount, 0).toLocaleString('es-CL')}</strong></p>
                </div>
              </div>
            )}

            {/* Gráficos de análisis del presupuesto */}
            <div className="charts-section">
              <h2>📊 Análisis del Presupuesto</h2>
              
              {/* Gráfico general del presupuesto */}
              <div className="chart-container">
                <h3>Distribución General del Presupuesto</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getBudgetOverviewData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value ? value.toLocaleString('es-CL') : '0'}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getBudgetOverviewData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-CL')}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de gastos fijos por categoría */}
              {userData?.budgetItems && userData.budgetItems.length > 0 && (
                <div className="chart-container">
                  <h3>Desglose de Gastos Fijos</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getFixedExpensesData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value ? value.toLocaleString('es-CL') : '0'}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getFixedExpensesData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-CL')}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Gráfico de gastos variables por categoría */}
              {transactions.length > 0 && (
                <div className="chart-container">
                  <h3>Desglose de Gastos Variables</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getVariableExpensesData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value ? value.toLocaleString('es-CL') : '0'}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getVariableExpensesData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-CL')}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shopping section removed completely */}


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
    </div>
  );
}

export default App;
