// Sistema de internacionalización simple

export interface Translations {
  // App general
  appTitle: string;
  appSubtitle: string;
  loading: string;
  
  // Navigation
  budgetTab: string;

  analysisTab: string;
  
  // Login
  loginTitle: string;
  loginSubtitle: string;
  continueWithGoogle: string;
  signingIn: string;
  loginFooter: string;
  
  // Auth errors
  authPopupClosed: string;
  authPopupBlocked: string;
  authCancelled: string;
  authNetworkError: string;
  authGenericError: string;
  
  // Alerts and confirmations
  errorAddingTransaction: string;
  errorAddingBudgetItem: string;
  errorUpdatingBudgetItem: string;
  errorDeletingBudgetItem: string;
  errorUpdatingTransaction: string;
  errorDeletingTransaction: string;
  confirmDeleteBudgetItem: string;
  confirmDeleteTransaction: string;

  errorSavingBudget: string;
  invalidAmount: string;
  amountTooHigh: string;
  
  // Budget section
  monthlyBudget: string;
  remainingBudget: string;
  usedBudget: string;
  setupBudget: string;
  addFixedExpense: string;
  addVariableExpense: string;
  fixedExpenses: string;
  variableExpenses: string;
  budgetAnalysis: string;
  overallBudget: string;
  fixedExpensesBreakdown: string;
  variableExpensesBreakdown: string;
  

  
  // Forms
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  add: string;
  amount: string;
  expenseDescription: string;
  monthlyAmount: string;
  
  // Welcome screen
  getStarted: string;
  visualBudget: string;
  visualBudgetDesc: string;
  smartTracking: string;
  smartTrackingDesc: string;
  personalPlanning: string;
  personalPlanningDesc: string;
  ctaDescription: string;
  
  // Categories
  housing: string;
  food: string;
  transportation: string;
  entertainment: string;
  health: string;
  education: string;
  savings: string;
  other: string;
  
  // Product Search
  searchProducts: string;
  searchPlaceholder: string;
  searching: string;
  search: string;
  searchResults: string;
  noResults: string;
  noResultsDescription: string;
  brand: string;
  quantity: string;
  total: string;
  addToMenu: string;
  notAvailable: string;
  
  // Budget Setup
  setupMonthlyBudget: string;
  setBudgetFor: string;
  budgetDescription: string;
  budgetExamples: string;
  savingBudget: string;
  saveBudget: string;
  connectingFirebase: string;
  flexibleBudget: string;
  flexibleBudgetDesc: string;
  automaticTracking: string;
  automaticTrackingDesc: string;
  
  // Error messages
  operationTimeout: string;
  noPermissions: string;
  firebaseUnavailable: string;
  connectionError: string;
  unknownError: string;
  tryAgain: string;
  userNotAuthenticated: string;
  invalidBudgetAmount: string;
  budgetTooHigh: string;
  
  // Premium features
  upgradeToPremium: string;
  monthly: string;
  premiumBenefits: string;
  fixedExpensesFeature: string;
  specialCategoriesFeature: string;
  budgetAnalysisFeature: string;
  variableBudgetFeature: string;
  upgradeNow: string;
  maybeLater: string;
  
  // Messages
  budgetSetupComplete: string;

  
  // Financial Analysis
  financialAnalysis: string;
  monthlyTrends: string;
  expensesByCategory: string;
  savingsRate: string;
  budgetEfficiency: string;
  projections: string;
  nextMonthProjection: string;
  averageMonthlyExpenses: string;
  highestExpenseCategory: string;
  lowestExpenseCategory: string;
  recommendedSavings: string;
  financialHealth: string;
  excellent: string;
  good: string;
  needsImprovement: string;
  critical: string;
  monthlyComparison: string;
  expenseTrend: string;
  savingsTrend: string;
  budgetUtilization: string;
  categoryBreakdown: string;
  fixed: string;
  variable: string;
}

const translations: Record<string, Translations> = {
  es: {
    // App general
    appTitle: 'MiPresupuesto',
    appSubtitle: 'Gestiona tu presupuesto personal y controla tus gastos',
    loading: 'Cargando...',
    
    // Navigation
    budgetTab: '📊 Presupuesto',
    analysisTab: '📈 Análisis',
    
    // Login
    loginTitle: 'Personal Budget',
  loginSubtitle: 'Organiza tu presupuesto y controla tus gastos personales',
    continueWithGoogle: 'Continuar con Google',
    signingIn: 'Iniciando sesión...',
    loginFooter: 'Al continuar, aceptas nuestros términos de servicio y política de privacidad',
    
    // Auth errors
    authPopupClosed: 'Ventana de autenticación cerrada. Intenta nuevamente.',
     authPopupBlocked: 'Popup bloqueado por el navegador. Permite popups para este sitio.',
     authCancelled: 'Solicitud de autenticación cancelada.',
     authNetworkError: 'Error de conexión. Verifica tu internet.',
      authGenericError: 'Error al iniciar sesión con Google. Intenta nuevamente.',
      
      // Alerts and confirmations
      errorAddingTransaction: 'Error al agregar la transacción',
      errorAddingBudgetItem: 'Error al agregar el gasto fijo',
      errorUpdatingBudgetItem: 'Error al actualizar el gasto fijo',
      errorDeletingBudgetItem: 'Error al eliminar el gasto fijo',
      errorUpdatingTransaction: 'Error al actualizar el gasto',
      errorDeletingTransaction: 'Error al eliminar el gasto',
      confirmDeleteBudgetItem: '¿Estás seguro de que quieres eliminar este gasto fijo?',
      confirmDeleteTransaction: '¿Estás seguro de que quieres eliminar este gasto?',
      errorSavingBudget: 'Error al guardar el presupuesto',
      invalidAmount: 'Monto inválido',
      amountTooHigh: 'Monto demasiado alto',
      
      // Budget section
    monthlyBudget: 'Presupuesto Mensual',
    remainingBudget: 'Presupuesto Restante',
    usedBudget: 'Presupuesto Usado',
    setupBudget: 'Configurar Presupuesto',
    addFixedExpense: 'Agregar Gasto Fijo',
    addVariableExpense: 'Agregar Gasto Variable',
    fixedExpenses: 'Gastos Fijos Mensuales',
    variableExpenses: 'Gastos Variables',
    budgetAnalysis: 'Análisis de Presupuesto',
    overallBudget: 'Distribución General del Presupuesto',
    fixedExpensesBreakdown: 'Desglose de Gastos Fijos',
    variableExpensesBreakdown: 'Desglose de Gastos Variables',
    

    
    // Forms
  save: 'Guardar',
  cancel: 'Cancelar',
  edit: 'Editar',
  delete: 'Eliminar',
  add: 'Agregar',
  amount: 'Monto',
  expenseDescription: 'Descripción del gasto',
  monthlyAmount: 'Monto mensual',
    
    // Welcome screen
    getStarted: 'Comenzar',
    visualBudget: 'Presupuesto Visual',
    visualBudgetDesc: 'Visualiza tus gastos con gráficos interactivos y mantén el control de tu presupuesto personal.',
    smartTracking: 'Seguimiento Inteligente',
    smartTrackingDesc: 'Registra y categoriza tus gastos automáticamente para un mejor control financiero.',
    personalPlanning: 'Planificación Personal',
  personalPlanningDesc: 'Planifica tus compras y gastos personales, mantén el control de tus finanzas.',
    ctaDescription: 'Únete a miles de personas que ya gestionan su presupuesto de manera inteligente',
    
    // Categories
    housing: 'Vivienda',
    food: 'Alimentación',
    transportation: 'Transporte',
    entertainment: 'Entretenimiento',
    health: 'Salud',
    education: 'Educación',
    savings: 'Ahorros',
    other: 'Otros',
    
    // Product Search
    searchProducts: 'Buscar Productos',
    searchPlaceholder: 'Buscar productos (ej: pollo, arroz, pan)...',
    searching: 'Buscando...',
    search: 'Buscar',
    searchResults: 'Resultados de búsqueda',
    noResults: 'No se encontraron productos para',
    noResultsDescription: 'Intenta con términos como: pollo, arroz, pan, leche, huevos',
    brand: 'Marca',
    quantity: 'Cantidad',
    total: 'Total',
    addToMenu: 'Agregar al Menú',
    notAvailable: 'No Disponible',
    
    // Budget Setup
    setupMonthlyBudget: 'Configura tu Presupuesto Mensual',
    setBudgetFor: 'Establece tu presupuesto para',
    budgetDescription: 'Este será tu presupuesto total disponible para compras y menús. Los gastos fijos como créditos y servicios se manejan por separado.',
    budgetExamples: 'Ejemplos de presupuesto:',
    savingBudget: 'Guardando presupuesto...',
    saveBudget: 'Guardar Presupuesto',
    connectingFirebase: 'Conectando con Firebase... Esto puede tardar unos segundos.',
    flexibleBudget: 'Presupuesto Flexible',
    flexibleBudgetDesc: 'Puedes cambiar tu presupuesto mensual en cualquier momento',
    automaticTracking: 'Seguimiento Automático',
    automaticTrackingDesc: 'Tus compras y menús se descontarán automáticamente',
    
    // Error messages
    operationTimeout: 'La operación está tardando más de lo esperado. Verifica tu conexión a internet e intenta nuevamente.',
    noPermissions: 'No tienes permisos para actualizar el presupuesto. Verifica tu autenticación.',
    firebaseUnavailable: 'Servicio de Firebase no disponible. Verifica tu conexión a internet.',
    connectionError: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
    unknownError: 'Error desconocido',
    tryAgain: 'Intenta nuevamente',
    userNotAuthenticated: 'Usuario no autenticado',
    invalidBudgetAmount: 'Por favor ingresa un presupuesto válido mayor a 0',
    budgetTooHigh: 'El presupuesto no puede ser mayor a $100.000.000',
     
     // Messages
    budgetSetupComplete: 'Presupuesto configurado exitosamente',
    
    // Premium features
    upgradeToPremium: 'Actualizar a Premium',
    monthly: 'Mensual',
    premiumBenefits: 'Beneficios Premium',
    fixedExpensesFeature: 'Gestión completa de gastos fijos mensuales',
    specialCategoriesFeature: 'Categorías especiales y personalizadas',
    budgetAnalysisFeature: 'Análisis detallado de presupuesto con gráficos',
    variableBudgetFeature: 'Presupuestos variables por categoría',
    upgradeNow: 'Actualizar Ahora',
    maybeLater: 'Tal vez más tarde',

    
    // Financial Analysis
    financialAnalysis: 'Análisis Financiero',
    monthlyTrends: 'Tendencias Mensuales',
    expensesByCategory: 'Gastos por Categoría',
    savingsRate: 'Tasa de Ahorro',
    budgetEfficiency: 'Eficiencia del Presupuesto',
    projections: 'Proyecciones',
    nextMonthProjection: 'Proyección Próximo Mes',
    averageMonthlyExpenses: 'Promedio Gastos Mensuales',
    highestExpenseCategory: 'Categoría de Mayor Gasto',
    lowestExpenseCategory: 'Categoría de Menor Gasto',
    recommendedSavings: 'Ahorro Recomendado',
    financialHealth: 'Salud Financiera',
    excellent: 'Excelente',
    good: 'Buena',
    needsImprovement: 'Necesita Mejora',
    critical: 'Crítica',
    monthlyComparison: 'Comparación Mensual',
    expenseTrend: 'Tendencia de Gastos',
    savingsTrend: 'Tendencia de Ahorros',
    budgetUtilization: 'Utilización del Presupuesto',
    categoryBreakdown: 'Desglose por Categorías',
    fixed: 'Fijos',
    variable: 'Variables'
  },
  
  en: {
    // App general
    appTitle: 'MyBudget',
    appSubtitle: 'Manage your personal budget and control your expenses',
    loading: 'Loading...',
    
    // Navigation
    budgetTab: '📊 Budget',
    analysisTab: '📈 Analysis',
    
    // Login
    loginTitle: 'Personal Budget',
  loginSubtitle: 'Organize your budget and control your personal expenses',
    continueWithGoogle: 'Continue with Google',
    signingIn: 'Signing in...',
    loginFooter: 'By continuing, you accept our terms of service and privacy policy',
    
    // Auth errors
    authPopupClosed: 'Authentication window closed. Please try again.',
    authPopupBlocked: 'Popup blocked by browser. Please allow popups for this site.',
    authCancelled: 'Authentication request cancelled.',
    authNetworkError: 'Connection error. Check your internet.',
      authGenericError: 'Error signing in with Google. Please try again.',
      
      // Alerts and confirmations
      errorAddingTransaction: 'Error adding transaction',
      errorAddingBudgetItem: 'Error adding fixed expense',
      errorUpdatingBudgetItem: 'Error updating fixed expense',
      errorDeletingBudgetItem: 'Error deleting fixed expense',
      errorUpdatingTransaction: 'Error updating expense',
      errorDeletingTransaction: 'Error deleting expense',
      confirmDeleteBudgetItem: 'Are you sure you want to delete this fixed expense?',
      confirmDeleteTransaction: 'Are you sure you want to delete this expense?',
      errorSavingBudget: 'Error saving budget',
      invalidAmount: 'Invalid amount',
      amountTooHigh: 'Amount too high',
      
      // Budget section
    monthlyBudget: 'Monthly Budget',
    remainingBudget: 'Remaining Budget',
    usedBudget: 'Used Budget',
    setupBudget: 'Setup Budget',
    addFixedExpense: 'Add Fixed Expense',
    addVariableExpense: 'Add Variable Expense',
    fixedExpenses: 'Monthly Fixed Expenses',
    variableExpenses: 'Variable Expenses',
    budgetAnalysis: 'Budget Analysis',
    overallBudget: 'Overall Budget Distribution',
    fixedExpensesBreakdown: 'Fixed Expenses Breakdown',
    variableExpensesBreakdown: 'Variable Expenses Breakdown',
    

    
    // Forms
  save: 'Save',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  add: 'Add',
  amount: 'Amount',
  expenseDescription: 'Expense description',
  monthlyAmount: 'Monthly amount',
    
    // Welcome screen
    getStarted: 'Get Started',
    visualBudget: 'Visual Budget',
    visualBudgetDesc: 'Visualize your expenses with interactive charts and keep control of your personal budget.',
    smartTracking: 'Smart Tracking',
    smartTrackingDesc: 'Record and categorize your expenses automatically for better financial control.',
    personalPlanning: 'Personal Planning',
  personalPlanningDesc: 'Plan your personal purchases and expenses, keep control of your finances.',
    ctaDescription: 'Join thousands of people who already manage their budget intelligently',
    
    // Categories
    housing: 'Housing',
    food: 'Food',
    transportation: 'Transportation',
    entertainment: 'Entertainment',
    health: 'Health',
    education: 'Education',
    savings: 'Savings',
    other: 'Other',
    
    // Product Search
    searchProducts: 'Search Products',
    searchPlaceholder: 'Search products (e.g: chicken, rice, bread)...',
    searching: 'Searching...',
    search: 'Search',
    searchResults: 'Search results',
    noResults: 'No products found for',
    noResultsDescription: 'Try terms like: chicken, rice, bread, milk, eggs',
    brand: 'Brand',
    quantity: 'Quantity',
    total: 'Total',
    addToMenu: 'Add to Menu',
    notAvailable: 'Not Available',
    
    // Budget Setup
    setupMonthlyBudget: 'Setup Your Monthly Budget',
    setBudgetFor: 'Set your budget for',
    budgetDescription: 'This will be your total available budget for purchases and menus. Fixed expenses like credits and services are handled separately.',
    budgetExamples: 'Budget examples:',
    savingBudget: 'Saving budget...',
    saveBudget: 'Save Budget',
    connectingFirebase: 'Connecting to Firebase... This may take a few seconds.',
    flexibleBudget: 'Flexible Budget',
    flexibleBudgetDesc: 'You can change your monthly budget at any time',
    automaticTracking: 'Automatic Tracking',
    automaticTrackingDesc: 'Your purchases and menus will be automatically deducted',
    
    // Error messages
    operationTimeout: 'The operation is taking longer than expected. Check your internet connection and try again.',
    noPermissions: 'You do not have permissions to update the budget. Verify your authentication.',
    firebaseUnavailable: 'Firebase service unavailable. Check your internet connection.',
    connectionError: 'Connection error. Check your internet and try again.',
    unknownError: 'Unknown error',
    tryAgain: 'Try again',
    userNotAuthenticated: 'User not authenticated',
    invalidBudgetAmount: 'Please enter a valid budget amount greater than 0',
    budgetTooHigh: 'Budget cannot be greater than $100,000,000',
    
    // Messages
    budgetSetupComplete: 'Budget setup completed successfully',
    
    // Premium features
    upgradeToPremium: 'Upgrade to Premium',
    monthly: 'Monthly',
    premiumBenefits: 'Premium Benefits',
    fixedExpensesFeature: 'Complete management of monthly fixed expenses',
    specialCategoriesFeature: 'Special and custom categories',
    budgetAnalysisFeature: 'Detailed budget analysis with charts',
    variableBudgetFeature: 'Variable budgets by category',
    upgradeNow: 'Upgrade Now',
    maybeLater: 'Maybe Later',

    
    // Financial Analysis
    financialAnalysis: 'Financial Analysis',
    monthlyTrends: 'Monthly Trends',
    expensesByCategory: 'Expenses by Category',
    savingsRate: 'Savings Rate',
    budgetEfficiency: 'Budget Efficiency',
    projections: 'Projections',
    nextMonthProjection: 'Next Month Projection',
    averageMonthlyExpenses: 'Average Monthly Expenses',
    highestExpenseCategory: 'Highest Expense Category',
    lowestExpenseCategory: 'Lowest Expense Category',
    recommendedSavings: 'Recommended Savings',
    financialHealth: 'Financial Health',
    excellent: 'Excellent',
    good: 'Good',
    needsImprovement: 'Needs Improvement',
    critical: 'Critical',
    monthlyComparison: 'Monthly Comparison',
    expenseTrend: 'Expense Trend',
    savingsTrend: 'Savings Trend',
    budgetUtilization: 'Budget Utilization',
    categoryBreakdown: 'Category Breakdown',
    fixed: 'Fixed',
    variable: 'Variable'
  },
  
  fr: {
    // App general
    appTitle: 'MonBudget',
    appSubtitle: 'Gérez votre budget personnel et contrôlez vos dépenses',
    loading: 'Chargement...',
    
    // Navigation
    budgetTab: '📊 Budget',
    analysisTab: '📈 Analyse',
    
    // Login
    loginTitle: 'Budget Personnel',
  loginSubtitle: 'Organisez votre budget et contrôlez vos dépenses personnelles',
    continueWithGoogle: 'Continuer avec Google',
    signingIn: 'Connexion en cours...',
    loginFooter: 'En continuant, vous acceptez nos conditions de service et politique de confidentialité',
    
    // Auth errors
    authPopupClosed: 'Fenêtre d\'authentification fermée. Veuillez réessayer.',
    authPopupBlocked: 'Popup bloqué par le navigateur. Veuillez autoriser les popups pour ce site.',
    authCancelled: 'Demande d\'authentification annulée.',
    authNetworkError: 'Erreur de connexion. Vérifiez votre internet.',
      authGenericError: 'Erreur lors de la connexion avec Google. Veuillez réessayer.',
      
      // Alerts and confirmations
      errorAddingTransaction: 'Erreur lors de l\'ajout de la transaction',
      errorAddingBudgetItem: 'Erreur lors de l\'ajout de la dépense fixe',
      errorUpdatingBudgetItem: 'Erreur lors de la mise à jour de la dépense fixe',
      errorDeletingBudgetItem: 'Erreur lors de la suppression de la dépense fixe',
      errorUpdatingTransaction: 'Erreur lors de la mise à jour de la dépense',
      errorDeletingTransaction: 'Erreur lors de la suppression de la dépense',
      confirmDeleteBudgetItem: 'Êtes-vous sûr de vouloir supprimer cette dépense fixe?',
      confirmDeleteTransaction: 'Êtes-vous sûr de vouloir supprimer cette dépense?',
      errorSavingBudget: 'Erreur lors de la sauvegarde du budget',
      invalidAmount: 'Montant invalide',
      amountTooHigh: 'Montant trop élevé',
      
      // Budget section
    monthlyBudget: 'Budget Mensuel',
    remainingBudget: 'Budget Restant',
    usedBudget: 'Budget Utilisé',
    setupBudget: 'Configurer le Budget',
    addFixedExpense: 'Ajouter Dépense Fixe',
    addVariableExpense: 'Ajouter Dépense Variable',
    fixedExpenses: 'Dépenses Fixes Mensuelles',
    variableExpenses: 'Dépenses Variables',
    budgetAnalysis: 'Analyse du Budget',
    overallBudget: 'Répartition Générale du Budget',
    fixedExpensesBreakdown: 'Répartition des Dépenses Fixes',
    variableExpensesBreakdown: 'Répartition des Dépenses Variables',
    

    
    // Forms
  save: 'Enregistrer',
  cancel: 'Annuler',
  edit: 'Modifier',
  delete: 'Supprimer',
  add: 'Ajouter',
  amount: 'Montant',
  expenseDescription: 'Description de la dépense',
  monthlyAmount: 'Montant mensuel',
    
    // Welcome screen
    getStarted: 'Commencer',
    visualBudget: 'Budget Visuel',
    visualBudgetDesc: 'Visualisez vos dépenses avec des graphiques interactifs et gardez le contrôle de votre budget personnel.',
    smartTracking: 'Suivi Intelligent',
    smartTrackingDesc: 'Enregistrez et catégorisez vos dépenses automatiquement pour un meilleur contrôle financier.',
    personalPlanning: 'Planification Personnelle',
  personalPlanningDesc: 'Planifiez vos achats et dépenses personnels, gardez le contrôle de vos finances.',
    ctaDescription: 'Rejoignez des milliers de personnes qui gèrent déjà leur budget intelligemment',
    
    // Categories
    housing: 'Logement',
    food: 'Alimentation',
    transportation: 'Transport',
    entertainment: 'Divertissement',
    health: 'Santé',
    education: 'Éducation',
    savings: 'Épargne',
    other: 'Autre',
    
    // Product Search
    searchProducts: 'Rechercher des Produits',
    searchPlaceholder: 'Rechercher des produits (ex: poulet, riz, pain)...',
    searching: 'Recherche...',
    search: 'Rechercher',
    searchResults: 'Résultats de recherche',
    noResults: 'Aucun produit trouvé pour',
    noResultsDescription: 'Essayez des termes comme: poulet, riz, pain, lait, œufs',
    brand: 'Marque',
    quantity: 'Quantité',
    total: 'Total',
    addToMenu: 'Ajouter au Menu',
    notAvailable: 'Non Disponible',
    
    // Budget Setup
    setupMonthlyBudget: 'Configurez votre Budget Mensuel',
    setBudgetFor: 'Définissez votre budget pour',
    budgetDescription: 'Ce sera votre budget total disponible pour les achats et menus. Les dépenses fixes comme les crédits et services sont gérées séparément.',
    budgetExamples: 'Exemples de budget:',
    savingBudget: 'Sauvegarde du budget...',
    saveBudget: 'Sauvegarder le Budget',
    connectingFirebase: 'Connexion à Firebase... Cela peut prendre quelques secondes.',
    flexibleBudget: 'Budget Flexible',
    flexibleBudgetDesc: 'Vous pouvez changer votre budget mensuel à tout moment',
    automaticTracking: 'Suivi Automatique',
    automaticTrackingDesc: 'Vos achats et menus seront automatiquement déduits',
    
    // Error messages
    operationTimeout: 'L\'opération prend plus de temps que prévu. Vérifiez votre connexion internet et réessayez.',
    noPermissions: 'Vous n\'avez pas les permissions pour mettre à jour le budget. Vérifiez votre authentification.',
    firebaseUnavailable: 'Service Firebase indisponible. Vérifiez votre connexion internet.',
    connectionError: 'Erreur de connexion. Vérifiez votre internet et réessayez.',
    unknownError: 'Erreur inconnue',
    tryAgain: 'Réessayez',
    userNotAuthenticated: 'Utilisateur non authentifié',
    invalidBudgetAmount: 'Veuillez saisir un montant de budget valide supérieur à 0',
    budgetTooHigh: 'Le budget ne peut pas être supérieur à 100 000 000 $',
    
    // Messages
    budgetSetupComplete: 'Configuration du budget terminée avec succès',
    
    // Premium features
    upgradeToPremium: 'Passer à Premium',
    monthly: 'Mensuel',
    premiumBenefits: 'Avantages Premium',
    fixedExpensesFeature: 'Gestion complète des dépenses fixes mensuelles',
    specialCategoriesFeature: 'Catégories spéciales et personnalisées',
    budgetAnalysisFeature: 'Analyse détaillée du budget avec graphiques',
    variableBudgetFeature: 'Budgets variables par catégorie',
    upgradeNow: 'Mettre à Niveau Maintenant',
    maybeLater: 'Peut-être Plus Tard',

    
    // Financial Analysis
    financialAnalysis: 'Analyse Financière',
    monthlyTrends: 'Tendances Mensuelles',
    expensesByCategory: 'Dépenses par Catégorie',
    savingsRate: 'Taux d\'Épargne',
    budgetEfficiency: 'Efficacité du Budget',
    projections: 'Projections',
    nextMonthProjection: 'Projection du Mois Prochain',
    averageMonthlyExpenses: 'Dépenses Mensuelles Moyennes',
    highestExpenseCategory: 'Catégorie de Dépense la Plus Élevée',
    lowestExpenseCategory: 'Catégorie de Dépense la Plus Faible',
    recommendedSavings: 'Épargne Recommandée',
    financialHealth: 'Santé Financière',
    excellent: 'Excellente',
    good: 'Bonne',
    needsImprovement: 'Nécessite une Amélioration',
    critical: 'Critique',
    monthlyComparison: 'Comparaison Mensuelle',
    expenseTrend: 'Tendance des Dépenses',
    savingsTrend: 'Tendance de l\'Épargne',
    budgetUtilization: 'Utilisation du Budget',
    categoryBreakdown: 'Répartition par Catégories',
    fixed: 'Fixes',
    variable: 'Variables'
  }
};

// Detectar idioma del navegador
export function detectBrowserLanguage(): string {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const langCode = browserLang.split('-')[0]; // Obtener solo el código del idioma (ej: 'es' de 'es-CL')
  
  // Verificar si tenemos traducciones para este idioma
  return translations[langCode] ? langCode : 'en';
}

// Hook personalizado para usar traducciones
export function useTranslations(): Translations {
  const currentLanguage = detectBrowserLanguage();
  return translations[currentLanguage];
}

// Función para obtener traducciones directamente
export function getTranslations(language?: string): Translations {
  const lang = language || detectBrowserLanguage();
  return translations[lang];
}

// Función para formatear precios según el idioma
export function formatPrice(price: number, language?: string): string {
  const lang = language || detectBrowserLanguage();
  
  if (lang === 'es') {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  } else if (lang === 'fr') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }
}

// Función para formatear fechas según el idioma
export function formatDate(date: Date, language?: string): string {
  const lang = language || detectBrowserLanguage();
  
  if (lang === 'es') {
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else if (lang === 'fr') {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}