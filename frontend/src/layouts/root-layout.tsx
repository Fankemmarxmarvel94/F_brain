import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * A root layout component that handles Clerk auth and routing.
 *
 * @returns The JSX for the root layout.
 */
const RootLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default RootLayout;