import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import {App} from './App.tsx'
import {NotificationContextProvider} from "./context/NotificationContext.tsx";
import {NotificationProvider} from "./context/NotificationContext2.tsx"; // Import NotificationProvider


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <NotificationContextProvider>
          <App />
      </NotificationContextProvider>
    </NotificationProvider>
  </StrictMode>,
)
