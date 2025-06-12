import { Outlet } from 'react-router-dom';
import React from 'react';

class DashboardLayout extends React.Component {
  render() {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-xl font-bold">Tableau de bord</h1>
            {/* Ajoutez ici les liens de navigation du tableau de bord */}
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardLayout;
