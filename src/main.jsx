import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import { ExpenseProvider } from './Context/ExpenseContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
    <ExpenseProvider>
      <App />
    </ExpenseProvider>
  </BrowserRouter>
)
