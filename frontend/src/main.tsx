import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {App} from './App.tsx'
import {NotificationContextProvider} from "./context/NotificationContext.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <NotificationContextProvider>
          <App />
      </NotificationContextProvider>
  </StrictMode>,
)
