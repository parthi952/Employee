import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EmployeeList } from './pages/EmployeeList';
import { EmployeeDetails } from './pages/EmployeeDetails';
import { EmployeeFormModal } from './pages/EmployeeFormModal';
import type { EmployeeData } from './pages/EmployeeFormModal';
import api from './services/api';

const AppLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState<EmployeeData | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Dashboard Overview';
    if (pathname === '/employees') return 'Employee Directory';
    if (pathname.startsWith('/employees/')) return 'Employee Profile';
    return 'WorkPulse Portal';
  };

  const handleOpenAddModal = () => {
    setEditEmployeeData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee: EmployeeData) => {
    setEditEmployeeData(employee);
    setIsModalOpen(true);
  };

  const handleFormSuccess = (msg: string) => {
    setToast({ message: msg, type: 'success' });
  };

  const handleDeleteRequest = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/employees/${id}`);
        setToast({ message: `${name} deleted successfully!`, type: 'success' });
        window.location.href = '/employees';
      } catch (err: any) {
        setToast({ message: 'Failed to delete employee.', type: 'error' });
      }
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f8fafc] flex text-[#0f172a] font-sans">
      <Sidebar 
        onOpenAddModal={handleOpenAddModal} 
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Navbar 
          title={getPageTitle(location.pathname)} 
          onOpenAddModal={handleOpenAddModal} 
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto min-h-0">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  onOpenAddModal={handleOpenAddModal} 
                  onOpenEditModal={handleOpenEditModal} 
                  toastMessage={toast?.message || ''} 
                />
              } 
            />
            <Route
              path="/employees"
              element={
                <EmployeeList
                  onOpenAddModal={handleOpenAddModal}
                  onOpenEditModal={handleOpenEditModal}
                  toastMessage={toast?.message || ''}
                />
              }
            />
            <Route
              path="/employees/:id"
              element={
                <EmployeeDetails
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleDeleteRequest}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFormSuccess}
        initialData={editEmployeeData}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AppLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
