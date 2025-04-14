import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import "./fontAwesome";

import {App} from './App.tsx'
import {NotificationContextProvider} from "./context/NotificationContext.tsx";
import {NotificationProvider} from "./context/NotificationContext2.tsx"; // Import NotificationProvider
import { AuthProvider } from './context/AuthContext.tsx'; // Import AuthProvider
import { AdminAuthProvider } from './context/AdminAuthContext.tsx'; // Import AdminAuthProvider


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
        <AdminAuthProvider>
          <NotificationProvider>
            <NotificationContextProvider>
                <App />
            </NotificationContextProvider>
          </NotificationProvider>
        </AdminAuthProvider>
    </AuthProvider>
  </StrictMode>,
)
