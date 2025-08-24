import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReduxProvider from './redux/provider.jsx'

createRoot(document.getElementById('root')).render(
  <ReduxProvider>
    <App />
  </ReduxProvider>
)