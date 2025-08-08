import React, { useState } from 'react';
import { listAllUsers, deleteMultipleUsers, UserInfo, displayUsersInfo } from '../utils/cleanupUsers';
import './AdminCleanup.css';

interface AdminCleanupProps {
  onClose: () => void;
}

const AdminCleanup: React.FC<AdminCleanupProps> = ({ onClose }) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersList = await listAllUsers();
      setUsers(usersList);
      displayUsersInfo(usersList); // También mostrar en consola
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error al cargar usuarios. Ver consola para detalles.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (uid: string) => {
    setSelectedUsers(prev => 
      prev.includes(uid) 
        ? prev.filter(id => id !== uid)
        : [...prev, uid]
    );
  };

  const selectTestUsers = () => {
    const testUsers = users.filter(user => {
      const hasMinimalData = user.categories.length === 0 && 
                           user.menus.length === 0 && 
                           user.routines.length === 0 && 
                           user.budgetItems.length === 0 && 
                           user.purchases.length === 0 &&
                           user.monthlyBudget === 0;
      return hasMinimalData;
    });
    
    setSelectedUsers(testUsers.map(user => user.uid));
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      alert('No hay usuarios seleccionados');
      return;
    }

    setLoading(true);
    try {
      await deleteMultipleUsers(selectedUsers);
      alert(`${selectedUsers.length} usuarios eliminados exitosamente`);
      setSelectedUsers([]);
      setShowConfirmation(false);
      // Recargar la lista
      await loadUsers();
    } catch (error) {
      console.error('Error deleting users:', error);
      alert('Error al eliminar usuarios. Ver consola para detalles.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Fecha desconocida';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('es-CL');
    }
    return 'Fecha desconocida';
  };

  const hasUserData = (user: UserInfo) => {
    return user.categories.length > 0 || 
           user.menus.length > 0 || 
           user.routines.length > 0 || 
           user.budgetItems.length > 0 || 
           user.purchases.length > 0 ||
           user.monthlyBudget > 0;
  };

  return (
    <div className="admin-cleanup-overlay">
      <div className="admin-cleanup-modal">
        <div className="admin-cleanup-header">
          <h2>🧹 Limpieza de Usuarios de Prueba</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="admin-cleanup-content">
          {!users.length ? (
            <div className="admin-cleanup-actions">
              <p>Cargar la lista de usuarios para comenzar la limpieza.</p>
              <button 
                className="load-users-button"
                onClick={loadUsers}
                disabled={loading}
              >
                {loading ? 'Cargando...' : '📋 Cargar Usuarios'}
              </button>
            </div>
          ) : (
            <>
              <div className="admin-cleanup-stats">
                <div className="stat">
                  <span className="stat-number">{users.length}</span>
                  <span className="stat-label">Total Usuarios</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{selectedUsers.length}</span>
                  <span className="stat-label">Seleccionados</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {users.filter(user => !hasUserData(user)).length}
                  </span>
                  <span className="stat-label">Sin Datos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    ${users.reduce((total, user) => 
                      total + user.purchases.reduce((sum, purchase) => sum + purchase.amount, 0), 0
                    ).toLocaleString('es-CL')}
                  </span>
                  <span className="stat-label">Total Gastos</span>
                </div>
              </div>

              <div className="admin-cleanup-actions">
                <button 
                  className="select-test-users-button"
                  onClick={selectTestUsers}
                >
                  🎯 Seleccionar Usuarios de Prueba
                </button>
                <button 
                  className="refresh-button"
                  onClick={loadUsers}
                  disabled={loading}
                >
                  🔄 Actualizar Lista
                </button>
                {selectedUsers.length > 0 && (
                  <button 
                    className="delete-button"
                    onClick={() => setShowConfirmation(true)}
                  >
                    🗑️ Eliminar Seleccionados ({selectedUsers.length})
                  </button>
                )}
              </div>

              <div className="users-list">
                {users.map((user) => (
                  <div 
                    key={user.uid} 
                    className={`user-item ${selectedUsers.includes(user.uid) ? 'selected' : ''} ${!hasUserData(user) ? 'test-user' : ''}`}
                  >
                    <div className="user-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.uid)}
                        onChange={() => toggleUserSelection(user.uid)}
                      />
                    </div>
                    <div className="user-info">
                      <div className="user-main">
                        <span className="user-name">{user.displayName}</span>
                        <span className="user-email">{user.email}</span>
                        {!hasUserData(user) && <span className="test-badge">PRUEBA</span>}
                      </div>
                      <div className="user-details">
                        <span>Creado: {formatDate(user.createdAt)}</span>
                        <span>Presupuesto: ${user.monthlyBudget.toLocaleString('es-CL')}</span>
                        <span>Datos: {user.categories.length + user.menus.length + user.routines.length + user.budgetItems.length + user.purchases.length} items</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-modal">
              <h3>⚠️ Confirmar Eliminación</h3>
              <p>
                Estás a punto de eliminar <strong>{selectedUsers.length}</strong> usuarios permanentemente.
              </p>
              <p>Esta acción no se puede deshacer.</p>
              <div className="confirmation-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="confirm-delete-button"
                  onClick={handleDeleteUsers}
                  disabled={loading}
                >
                  {loading ? 'Eliminando...' : 'Sí, Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCleanup;