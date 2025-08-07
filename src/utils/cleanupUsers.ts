import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface UserInfo {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any;
  monthlyBudget: number;
  categories: any[];
  menus: any[];
  routines: any[];
  budgetItems: any[];
  purchases: any[];
}

/**
 * Lista todos los usuarios en Firestore
 */
export async function listAllUsers(): Promise<UserInfo[]> {
  try {
    console.log('🔍 Obteniendo lista de usuarios...');
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    const users: UserInfo[] = [];
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        uid: doc.id,
        email: userData.email || 'Sin email',
        displayName: userData.displayName || 'Sin nombre',
        createdAt: userData.createdAt,
        monthlyBudget: userData.monthlyBudget || 0,
        categories: userData.categories || [],
        menus: userData.menus || [],
        routines: userData.routines || [],
        budgetItems: userData.budgetItems || [],
        purchases: userData.purchases || []
      });
    });
    
    console.log(`✅ Se encontraron ${users.length} usuarios`);
    return users;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    throw error;
  }
}

/**
 * Elimina un usuario específico por UID
 */
export async function deleteUser(uid: string): Promise<void> {
  try {
    console.log(`🗑️ Eliminando usuario: ${uid}`);
    const userDoc = doc(db, 'users', uid);
    await deleteDoc(userDoc);
    console.log(`✅ Usuario ${uid} eliminado exitosamente`);
  } catch (error) {
    console.error(`❌ Error al eliminar usuario ${uid}:`, error);
    throw error;
  }
}

/**
 * Elimina múltiples usuarios por sus UIDs
 */
export async function deleteMultipleUsers(uids: string[]): Promise<void> {
  console.log(`🗑️ Eliminando ${uids.length} usuarios...`);
  
  for (const uid of uids) {
    try {
      await deleteUser(uid);
    } catch (error) {
      console.error(`❌ Error al eliminar usuario ${uid}:`, error);
      // Continúa con el siguiente usuario aunque uno falle
    }
  }
  
  console.log('✅ Proceso de eliminación completado');
}

/**
 * Función de utilidad para mostrar información de usuarios en consola
 */
export function displayUsersInfo(users: UserInfo[]): void {
  console.log('\n📋 LISTA DE USUARIOS:');
  console.log('='.repeat(80));
  
  users.forEach((user, index) => {
    const createdDate = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('es-CL') : 'Fecha desconocida';
    const hasData = user.categories.length > 0 || user.menus.length > 0 || user.routines.length > 0 || user.budgetItems.length > 0 || user.purchases.length > 0;
    
    console.log(`\n${index + 1}. UID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.displayName}`);
    console.log(`   Creado: ${createdDate}`);
    console.log(`   Presupuesto: $${user.monthlyBudget.toLocaleString('es-CL')}`);
    console.log(`   Categorías: ${user.categories.length}`);
    console.log(`   Menús: ${user.menus.length}`);
    console.log(`   Rutinas: ${user.routines.length}`);
    console.log(`   Items presupuesto: ${user.budgetItems.length}`);
    console.log(`   Compras: ${user.purchases.length}`);
    console.log(`   Tiene datos: ${hasData ? '✅ Sí' : '❌ No'}`);
  });
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Función para limpiar usuarios de prueba (sin datos importantes)
 */
export async function cleanupTestUsers(): Promise<void> {
  try {
    const users = await listAllUsers();
    displayUsersInfo(users);
    
    // Identificar usuarios de prueba (sin datos importantes)
    const testUsers = users.filter(user => {
      const hasMinimalData = user.categories.length === 0 && 
                           user.menus.length === 0 && 
                           user.routines.length === 0 && 
                           user.budgetItems.length === 0 && 
                           user.purchases.length === 0 &&
                           user.monthlyBudget === 0;
      return hasMinimalData;
    });
    
    if (testUsers.length === 0) {
      console.log('\n✅ No se encontraron usuarios de prueba para eliminar');
      return;
    }
    
    console.log(`\n🧹 Se encontraron ${testUsers.length} usuarios de prueba (sin datos):`);
    testUsers.forEach(user => {
      console.log(`- ${user.email} (${user.displayName})`);
    });
    
    console.log('\n⚠️ ADVERTENCIA: Esta acción eliminará permanentemente estos usuarios.');
    console.log('Para continuar, ejecuta: await deleteMultipleUsers([...uids])');
    
    return;
  } catch (error) {
    console.error('❌ Error en cleanup:', error);
    throw error;
  }
}

// Función de ejemplo para usar en la consola del navegador
export const cleanupExample = {
  // Listar todos los usuarios
  listUsers: async () => {
    const users = await listAllUsers();
    displayUsersInfo(users);
    return users;
  },
  
  // Limpiar usuarios de prueba
  cleanup: cleanupTestUsers,
  
  // Eliminar usuarios específicos (usar con cuidado)
  deleteUsers: deleteMultipleUsers
};

// Para usar en la consola del navegador:
// import { cleanupExample } from './utils/cleanupUsers';
// window.cleanup = cleanupExample;
// cleanup.listUsers(); // Ver todos los usuarios
// cleanup.cleanup(); // Identificar usuarios de prueba
// cleanup.deleteUsers(['uid1', 'uid2']); // Eliminar usuarios específicos