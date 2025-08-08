import React from 'react';
import PremiumFeature from './PremiumFeature';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Función para formatear precios en pesos chilenos
const formatPrice = (amount: number): string => {
  return `$${amount.toLocaleString('es-CL')}`;
};

interface Expense {
  name?: string;
  description?: string;
  amount: number;
  category: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface FinancialAnalysisProps {
  monthlyBudget: number;
  fixedExpenses: Expense[];
  variableExpenses: Expense[];
  allTransactions?: Transaction[];
}

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({
  monthlyBudget,
  fixedExpenses,
  variableExpenses,
  allTransactions = []
}) => {
  const { isPremium } = useSubscription();

  // Debug logs
  console.log('🔍 FinancialAnalysis - Props recibidas:');
  console.log('📊 monthlyBudget:', monthlyBudget);
  console.log('🏠 fixedExpenses:', fixedExpenses);
  console.log('💸 variableExpenses:', variableExpenses);
  console.log('📝 variableExpenses length:', variableExpenses?.length || 0);

  // Calculate financial metrics
  const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalVariableExpenses = variableExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  console.log('💰 totalFixedExpenses calculado:', totalFixedExpenses);
  console.log('💸 totalVariableExpenses calculado:', totalVariableExpenses);
  const totalExpenses = totalFixedExpenses + totalVariableExpenses;
  const remainingBudget = monthlyBudget - totalExpenses;
  const savingsRate = monthlyBudget > 0 ? (remainingBudget / monthlyBudget) * 100 : 0;
  const budgetUtilization = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

  // Calculate category breakdown
  const allExpenses = [...fixedExpenses, ...variableExpenses];
  const categoryTotals = allExpenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Chart data functions
  const getBudgetOverviewData = () => {
    const data = [
      { name: 'Gastos Fijos', value: totalFixedExpenses, color: '#8884d8' },
      { name: 'Gastos Variables', value: totalVariableExpenses, color: '#82ca9d' },
      { name: 'Presupuesto Restante', value: Math.max(0, remainingBudget), color: '#ffc658' }
    ];
    return data.filter(item => item.value > 0);
  };

  const getFixedExpensesData = () => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];
    return fixedExpenses.map((expense, index) => ({
      name: expense.name || expense.description || 'Sin nombre',
      value: expense.amount,
      color: colors[index % colors.length]
    }));
  };

  const getVariableExpensesData = () => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];
    const categoryData = Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: colors[index % colors.length]
    }));
    return categoryData;
  };

  // Generate monthly trends data from actual transactions
  const getMonthlyTrendsData = () => {
    if (!allTransactions || allTransactions.length === 0) {
      return { monthlyData: [], monthLabels: [] };
    }

    // Group transactions by month
    const monthlyExpenses: Record<string, number> = {};
    
    allTransactions.forEach(transaction => {
      try {
        let transactionDate;
        if (transaction.date.includes('/')) {
          const parts = transaction.date.split('/');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            transactionDate = new Date(`${year}-${month}-${day}`);
          } else {
            transactionDate = new Date(transaction.date);
          }
        } else {
          transactionDate = new Date(transaction.date);
        }
        
        if (!isNaN(transactionDate.getTime())) {
          const monthKey = `${transactionDate.getUTCFullYear()}-${String(transactionDate.getUTCMonth() + 1).padStart(2, '0')}`;
          monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + transaction.amount;
        }
      } catch (error) {
        console.warn('Error processing transaction date:', transaction.date);
      }
    });

    // Sort months and get data
    const sortedMonths = Object.keys(monthlyExpenses).sort();
    const monthLabels = sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-');
      const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
      return date.toLocaleDateString('es-CL', { month: 'short', timeZone: 'UTC' }).replace('.', '');
    });
    
    const monthlyData = sortedMonths.map(monthKey => monthlyExpenses[monthKey]);
    const maxAmount = Math.max(...monthlyData);
    const normalizedData = monthlyData.map(amount => (amount / maxAmount) * 100);

    return { monthlyData: normalizedData, monthLabels, rawData: monthlyData };
  };

  const { monthlyData, monthLabels, rawData } = getMonthlyTrendsData();



  // Financial health assessment
  const getFinancialHealth = () => {
    if (savingsRate >= 20) return { status: 'Excelente', color: '#10B981' };
    if (savingsRate >= 10) return { status: 'Buena', color: '#3B82F6' };
    if (savingsRate >= 0) return { status: 'Necesita Mejora', color: '#F59E0B' };
    return { status: 'Crítica', color: '#EF4444' };
  };

  const healthStatus = getFinancialHealth();

  // Projections
  const nextMonthProjection = monthlyBudget - totalFixedExpenses;
  const recommendedSavings = monthlyBudget * 0.2; // 20% rule

  return (
    <div className="financial-analysis">
      <div className="analysis-header">
        <h2>Análisis Financiero</h2>
        <div className="health-indicator">
          <span className="health-label">Salud Financiera:</span>
          <span 
            className="health-status" 
            style={{ color: healthStatus.color, fontWeight: 'bold' }}
          >
            {healthStatus.status}
          </span>
        </div>
      </div>

      <div className="analysis-grid">
        {/* Premium Budget Metrics */}
        <PremiumFeature title="Métricas de Presupuesto">
          <div className="metric-card">
            <h3>Eficiencia del Presupuesto</h3>
            <div className="metric-value">
              <span className="percentage">{budgetUtilization.toFixed(1)}%</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(budgetUtilization, 100)}%`,
                    backgroundColor: budgetUtilization > 100 ? '#EF4444' : '#3B82F6'
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3>Tasa de Ahorro</h3>
            <div className="metric-value">
              <span className="percentage" style={{ color: healthStatus.color }}>
                {savingsRate.toFixed(1)}%
              </span>
              <div className="metric-amount">
                {formatPrice(remainingBudget)}
              </div>
            </div>
          </div>
        </PremiumFeature>

        {/* Basic Expense Analysis - Always Available */}
        <div className="metric-card">
          <h3>Promedio Gastos Mensuales</h3>
          <div className="metric-value">
            <span className="amount">{formatPrice(totalExpenses)}</span>
            {isPremium && (
              <div className="breakdown">
                <span>Fijos: {formatPrice(totalFixedExpenses)}</span>
                <span>Variables: {formatPrice(totalVariableExpenses)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown - Pie Chart */}
        <div className="category-breakdown-card">
          <h3>Desglose por Categorías</h3>
          {sortedCategories.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sortedCategories.map(([category, amount], index) => ({
                      name: category,
                      value: amount,
                      color: `hsl(${index * 60}, 70%, 50%)`
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${percent ? (percent * 100).toFixed(1) : '0'}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sortedCategories.map(([, ], index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatPrice(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-data-message">
              <span>📊</span>
              <p>No hay categorías para mostrar</p>
            </div>
          )}
        </div>



        {/* Premium Projections */}
        <PremiumFeature title="Proyecciones y Recomendaciones">
          <div className="projections-card">
            <h3>Proyecciones</h3>
            <div className="projection-items">
              <div className="projection-item">
                <span className="projection-label">Proyección Próximo Mes</span>
                <span className="projection-value">{formatPrice(nextMonthProjection)}</span>
              </div>
              <div className="projection-item">
                <span className="projection-label">Ahorro Recomendado</span>
                <span className="projection-value">{formatPrice(recommendedSavings)}</span>
              </div>
              {sortedCategories.length > 0 && (
                <>
                  <div className="projection-item">
                    <span className="projection-label">Categoría de Mayor Gasto</span>
                    <span className="projection-value">{sortedCategories[0][0]}</span>
                  </div>
                  {sortedCategories.length > 1 && (
                    <div className="projection-item">
                      <span className="projection-label">Categoría de Menor Gasto</span>
                      <span className="projection-value">{sortedCategories[sortedCategories.length - 1][0]}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </PremiumFeature>

        {/* Gráficos de análisis del presupuesto */}
        <PremiumFeature title="Gráficos de Análisis del Presupuesto">
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
            {fixedExpenses && fixedExpenses.length > 0 && (
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
            {variableExpenses.length > 0 && (
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
        </PremiumFeature>

        {/* Monthly Trends - Dynamic - Solo mostrar si hay más de 1 mes */}
        {monthLabels.length > 1 && (
          <div className="trends-card">
            <h3>Tendencias Mensuales</h3>
            {monthLabels.length > 0 ? (
            <div className="trend-placeholder">
              <div className="trend-chart">
                <div className="chart-bars">
                  {monthlyData.map((height, index) => (
                    <div 
                      key={index}
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                      title={`${monthLabels[index]}: $${rawData?.[index]?.toLocaleString('es-CL') || '0'}`}
                    ></div>
                  ))}
                </div>
                <div className="chart-labels">
                  {monthLabels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
              </div>
              <div className="trend-summary">
                <div className="trend-item">
                  <span className="trend-icon">📊</span>
                  <span>Meses con datos: {monthLabels.length}</span>
                </div>
                <div className="trend-item">
                  <span className="trend-icon">💰</span>
                  <span>Total: ${rawData?.reduce((sum, amount) => sum + amount, 0)?.toLocaleString('es-CL') || '0'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="trend-placeholder">
              <div className="no-data-message">
                <span>📊</span>
                <p>No hay datos de transacciones para mostrar tendencias mensuales</p>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialAnalysis;