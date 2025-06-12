import { Outlet } from 'react-router-dom';
import React from 'react';

class RootLayout extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Ici vous pouvez ajouter votre en-tête, navigation, etc. */}
        <main>
          <Outlet />
        </main>
        {/* Ici vous pouvez ajouter votre pied de page */}
      </div>
    );
  }
}

export default RootLayout;
