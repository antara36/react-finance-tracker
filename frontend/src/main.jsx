import React from "react"
import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client";

import { BrowserRouter} from "react-router-dom";
import {TransactionProvider} from "./context/TransactionContext";

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
  <BrowserRouter>
    <TransactionProvider>
      <App/>
    </TransactionProvider>
  </BrowserRouter>
 </React.StrictMode>
)
