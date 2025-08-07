import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  monthlyBudget: number;
  currentMonthSpent: number;
  budgetMonth: string; // formato: "2024-01"
  categories: Category[];
  menus: Menu[];
  routines: Routine[];
  budgetItems: BudgetItem[];
  purchases: Purchase[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
  totalCost: number;
  createdAt: Timestamp;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  store: string;
}

export interface Routine {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: Timestamp;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  time?: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: 'credito' | 'servicios' | 'hipoteca' | 'otros';
  isRecurring: boolean;
}

export interface Purchase {
  id: string;
  name: string;
  amount: number;
  category: string; // Ahora permite cualquier categoría definida por el usuario
  date: Timestamp;
  menuId?: string; // si la compra es de un menú
  isMenuPurchase?: boolean; // para distinguir compras de menú de gastos variables
}

class UserService {
  private getUserRef(uid: string) {
    return doc(db, 'users', uid);
  }

  async createUser(userData: Partial<UserData>): Promise<void> {
    const userRef = this.getUserRef(userData.uid!);
    const now = Timestamp.now();
    const currentMonth = new Date().toISOString().slice(0, 7); // "2024-01"
    
    const defaultUserData: UserData = {
      uid: userData.uid!,
      email: userData.email!,
      displayName: userData.displayName!,
      photoURL: userData.photoURL,
      monthlyBudget: 0,
      currentMonthSpent: 0,
      budgetMonth: currentMonth,
      categories: [],
      menus: [],
      routines: [],
      budgetItems: [],
      purchases: [],
      createdAt: now,
      updatedAt: now,
      ...userData
    };

    await setDoc(userRef, defaultUserData);
  }

  async getUser(uid: string): Promise<UserData | null> {
    const userRef = this.getUserRef(uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    return null;
  }

  async updateMonthlyBudget(uid: string, budget: number): Promise<void> {
    try {
      console.log('🔄 Iniciando updateMonthlyBudget:', { uid, budget });
      
      const userRef = this.getUserRef(uid);
      console.log('📄 Referencia de usuario obtenida:', userRef.path);
      
      // Verificar si el usuario existe
      console.log('🔍 Verificando si el usuario existe...');
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log('⚠️ Usuario no existe, creando usuario primero...');
        // Si el usuario no existe, necesitamos crearlo primero
        throw new Error('Usuario no encontrado en Firestore. Necesita ser creado primero.');
      }
      
      console.log('✅ Usuario existe, procediendo con la actualización');
      
      const currentMonth = new Date().toISOString().slice(0, 7);
      console.log('📅 Mes actual:', currentMonth);
      
      const updateData = {
        monthlyBudget: budget,
        budgetMonth: currentMonth,
        currentMonthSpent: 0,
        updatedAt: Timestamp.now()
      };
      console.log('📝 Datos a actualizar:', updateData);
      
      console.log('🚀 Ejecutando updateDoc...');
      await updateDoc(userRef, updateData);
      console.log('✅ updateMonthlyBudget completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error en updateMonthlyBudget:', error);
      console.error('Error code:', (error as any)?.code);
      console.error('Error message:', (error as any)?.message);
      throw error;
    }
  }

  async addMenu(uid: string, menu: Menu): Promise<void> {
    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      menus: arrayUnion(menu),
      updatedAt: Timestamp.now()
    });
  }

  async updateMenu(uid: string, updatedMenu: Menu): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const updatedMenus = user.menus.map(menu => 
      menu.id === updatedMenu.id ? updatedMenu : menu
    );

    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      menus: updatedMenus,
      updatedAt: Timestamp.now()
    });
  }

  async deleteMenu(uid: string, menuId: string): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const menuToDelete = user.menus.find(menu => menu.id === menuId);
    if (menuToDelete) {
      const userRef = this.getUserRef(uid);
      await updateDoc(userRef, {
        menus: arrayRemove(menuToDelete),
        updatedAt: Timestamp.now()
      });
    }
  }

  async addRoutine(uid: string, routine: Routine): Promise<void> {
    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      routines: arrayUnion(routine),
      updatedAt: Timestamp.now()
    });
  }

  async updateRoutine(uid: string, updatedRoutine: Routine): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const updatedRoutines = user.routines.map(routine => 
      routine.id === updatedRoutine.id ? updatedRoutine : routine
    );

    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      routines: updatedRoutines,
      updatedAt: Timestamp.now()
    });
  }

  async deleteRoutine(uid: string, routineId: string): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const routineToDelete = user.routines.find(routine => routine.id === routineId);
    if (routineToDelete) {
      const userRef = this.getUserRef(uid);
      await updateDoc(userRef, {
        routines: arrayRemove(routineToDelete),
        updatedAt: Timestamp.now()
      });
    }
  }

  async addBudgetItem(uid: string, budgetItem: BudgetItem): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    let newCurrentMonthSpent = user.currentMonthSpent;
    
    // Si es el mismo mes, sumar al gasto actual
    if (user.budgetMonth === currentMonth) {
      newCurrentMonthSpent += budgetItem.amount;
    } else {
      // Si es un nuevo mes, resetear el contador y agregar el gasto fijo
      newCurrentMonthSpent = budgetItem.amount;
    }

    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      budgetItems: arrayUnion(budgetItem),
      currentMonthSpent: newCurrentMonthSpent,
      budgetMonth: currentMonth,
      updatedAt: Timestamp.now()
    });
  }

  async updateBudgetItem(uid: string, updatedBudgetItem: BudgetItem): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const updatedBudgetItems = user.budgetItems.map(item => 
      item.id === updatedBudgetItem.id ? updatedBudgetItem : item
    );

    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      budgetItems: updatedBudgetItems,
      updatedAt: Timestamp.now()
    });
  }

  async deleteBudgetItem(uid: string, budgetItemId: string): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const itemToDelete = user.budgetItems.find(item => item.id === budgetItemId);
    if (itemToDelete) {
      const userRef = this.getUserRef(uid);
      await updateDoc(userRef, {
        budgetItems: arrayRemove(itemToDelete),
        updatedAt: Timestamp.now()
      });
    }
  }

  async addPurchase(uid: string, purchase: Purchase): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    let newCurrentMonthSpent = user.currentMonthSpent;
    
    // Si es el mismo mes, sumar al gasto actual
    if (user.budgetMonth === currentMonth) {
      newCurrentMonthSpent += purchase.amount;
    } else {
      // Si es un nuevo mes, resetear el contador
      newCurrentMonthSpent = purchase.amount;
    }

    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      purchases: arrayUnion(purchase),
      currentMonthSpent: newCurrentMonthSpent,
      budgetMonth: currentMonth,
      updatedAt: Timestamp.now()
    });
  }

  async updatePurchase(uid: string, updatedPurchase: Purchase): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const oldPurchase = user.purchases.find(p => p.id === updatedPurchase.id);
    if (!oldPurchase) return;

    const updatedPurchases = user.purchases.map(purchase => 
      purchase.id === updatedPurchase.id ? updatedPurchase : purchase
    );

    // Recalcular currentMonthSpent
    const currentMonth = new Date().toISOString().slice(0, 7);
    let newCurrentMonthSpent = user.currentMonthSpent;
    
    // Si es el mismo mes, ajustar la diferencia
    if (user.budgetMonth === currentMonth) {
      const difference = updatedPurchase.amount - oldPurchase.amount;
      newCurrentMonthSpent += difference;
    }

    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      purchases: updatedPurchases,
      currentMonthSpent: newCurrentMonthSpent,
      updatedAt: Timestamp.now()
    });
  }

  async deletePurchase(uid: string, purchaseId: string): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const purchaseToDelete = user.purchases.find(p => p.id === purchaseId);
    if (!purchaseToDelete) return;

    // Recalcular currentMonthSpent
    const currentMonth = new Date().toISOString().slice(0, 7);
    let newCurrentMonthSpent = user.currentMonthSpent;
    
    // Si es el mismo mes, restar el monto eliminado
    if (user.budgetMonth === currentMonth) {
      newCurrentMonthSpent -= purchaseToDelete.amount;
    }

    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      purchases: arrayRemove(purchaseToDelete),
      currentMonthSpent: Math.max(0, newCurrentMonthSpent), // Evitar valores negativos
      updatedAt: Timestamp.now()
    });
  }

  async purchaseMenu(uid: string, menuId: string): Promise<void> {
    const user = await this.getUser(uid);
    if (!user) return;

    const menu = user.menus.find(m => m.id === menuId);
    if (!menu) return;

    const purchase: Purchase = {
      id: `purchase_${Date.now()}`,
      name: `Menú: ${menu.name}`,
      amount: menu.totalCost,
      category: 'Menú',
      date: Timestamp.now(),
      menuId: menuId,
      isMenuPurchase: true
    };

    await this.addPurchase(uid, purchase);
  }

  async getRemainingBudget(uid: string): Promise<number> {
    const user = await this.getUser(uid);
    if (!user) return 0;

    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Si es un nuevo mes, el gasto actual es 0
    if (user.budgetMonth !== currentMonth) {
      return user.monthlyBudget;
    }

    return user.monthlyBudget - user.currentMonthSpent;
  }

  async updateUserCategories(uid: string, categories: Category[]): Promise<void> {
    const userRef = this.getUserRef(uid);
    await updateDoc(userRef, {
      categories: categories,
      updatedAt: Timestamp.now()
    });
  }
}

export const userService = new UserService();