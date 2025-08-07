import React from 'react';
import { useTranslations, formatPrice } from '../utils/i18n';
import PremiumFeature from './PremiumFeature';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Expense {
  name?: string;
  description?: string;
  amount: number;
  category: string;
}

interface FinancialAnalysisProps {
  monthlyBudget: number;
  fixedExpenses: Expense[];
  variableExpenses: Expense[];
}

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({
  monthlyBudget,
  fixedExpenses,
  variableExpenses
}) => {
  const t = useTranslations();
  const { isPremium } = useSubscription();

  // Calculate financial metrics
  const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalVariableExpenses = variableExpenses.reduce((sum, expense) => sum + expense.amount, 0);
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



  // Financial health assessment
  const getFinancialHealth = () => {
    if (savingsRate >= 20) return { status: t.excellent, color: '#10B981' };
    if (savingsRate >= 10) return { status: t.good, color: '#3B82F6' };
    if (savingsRate >= 0) return { status: t.needsImprovement, color: '#F59E0B' };
    return { status: t.critical, color: '#EF4444' };
  };

  const healthStatus = getFinancialHealth();

  // Projections
  const nextMonthProjection = monthlyBudget - totalFixedExpenses;
  const recommendedSavings = monthlyBudget * 0.2; // 20% rule

  return (
    <div className="financial-analysis">
      <div className="analysis-header">
        <h2>{t.financialAnalysis}</h2>
        <div className="health-indicator">
          <span className="health-label">{t.financialHealth}:</span>
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
            <h3>{t.budgetEfficiency}</h3>
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
            <h3>{t.savingsRate}</h3>
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
          <h3>{t.averageMonthlyExpenses}</h3>
          <div className="metric-value">
            <span className="amount">{formatPrice(totalExpenses)}</span>
            {isPremium && (
              <div className="breakdown">
                <span>{t.fixed}: {formatPrice(totalFixedExpenses)}</span>
                <span>{t.variable}: {formatPrice(totalVariableExpenses)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="category-breakdown-card">
          <h3>{t.categoryBreakdown}</h3>
          <div className="category-list">
            {sortedCategories.map(([category, amount], index) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              return (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-amount">{formatPrice(amount)}</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                  <span className="category-percentage">{percentage.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>



        {/* Premium Projections */}
        <PremiumFeature title="Proyecciones y Recomendaciones">
          <div className="projections-card">
            <h3>{t.projections}</h3>
            <div className="projection-items">
              <div className="projection-item">
                <span className="projection-label">{t.nextMonthProjection}</span>
                <span className="projection-value">{formatPrice(nextMonthProjection)}</span>
              </div>
              <div className="projection-item">
                <span className="projection-label">{t.recommendedSavings}</span>
                <span className="projection-value">{formatPrice(recommendedSavings)}</span>
              </div>
              {sortedCategories.length > 0 && (
                <>
                  <div className="projection-item">
                    <span className="projection-label">{t.highestExpenseCategory}</span>
                    <span className="projection-value">{sortedCategories[0][0]}</span>
                  </div>
                  {sortedCategories.length > 1 && (
                    <div className="projection-item">
                      <span className="projection-label">{t.lowestExpenseCategory}</span>
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

        {/* Monthly Trends Placeholder */}
        <div className="trends-card">
          <h3>{t.monthlyTrends}</h3>
          <div className="trend-placeholder">
            <div className="trend-chart">
              <div className="chart-bars">
                {[65, 45, 80, 60, 75, 55].map((height, index) => (
                  <div 
                    key={index}
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="chart-labels">
                <span>Ene</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
            <div className="trend-summary">
              <div className="trend-item">
                <span className="trend-icon">📈</span>
                <span>{t.expenseTrend}: +5.2%</span>
              </div>
              <div className="trend-item">
                <span className="trend-icon">💰</span>
                <span>{t.savingsTrend}: +12.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;