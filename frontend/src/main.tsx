'use client';

import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import "./index.css";
import "./utils/I18nConfig";

// Import the layouts
import RootLayout from './layouts/root-layout';
// import DashboardLayout from './layouts/dashboard-layout';

// Import the components
import IndexPage from './pages/index';
// import ContactPage from './pages/contact';
// import DashboardPage from './pages/dashboard/dashboard';
// import InvoicesPage from './pages/dashboard/invoices';
// import SignInPage from './pages/authentication/sign-in';
// import SignUpPage from './pages/authentication/sign-up';
// import ForgotPasswordPage from "./pages/authentication/forgot-password";
// import Profile from './pages/user/profile';
// import MyListing from "./components/profile/MyListing";
// import Favorites from "./components/profile/Favorites";
// import Billing from "./components/profile/Billing";

type RootComponentProps = object

interface RootComponentState {
  router: ReturnType<typeof createBrowserRouter>;
}

class RootComponent extends Component<object, RootComponentState> {
  constructor(props: RootComponentProps) {
    super(props);

    this.state = {
      router: createBrowserRouter([
        {
          element: <RootLayout />,
          children: [
            { path: '/', element: <IndexPage /> },
          ],
        },
      ]),
    };
  }

  render() {
    return (
      <React.StrictMode>
        <React.Suspense fallback='loading...'>
          <RouterProvider router={this.state.router} />
        </React.Suspense>
      </React.StrictMode>
    );
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<RootComponent />);
}