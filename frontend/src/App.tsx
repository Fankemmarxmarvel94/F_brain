import React, { Component } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

// Import des layouts
import RootLayout from './layouts/RootLayout';

// Import des pages
import IndexPage from './pages/IndexPage';
import ContactPage from './pages/ContactPage';

// Définition des propriétés du composant App
type AppProps = Record<string, never>; // Équivalent à {}

type AppState = {
  router: ReturnType<typeof createBrowserRouter>;
};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    
    this.state = {
      router: createBrowserRouter([
        {
          element: <RootLayout />,
          children: [
            { path: '/', element: <IndexPage /> },
            { path: '/contact', element: <ContactPage /> },
          ],
        },
      ]),
    };
  }

  render() {
    return (
      <React.StrictMode>
        <React.Suspense fallback="Loading...">
          <RouterProvider router={this.state.router} />
        </React.Suspense>
      </React.StrictMode>
    );
  }
}

export default App;
