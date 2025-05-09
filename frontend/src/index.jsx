import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Your main App component
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

// Wrap your entire app with AuthProvider to provide context to all components
ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root') // The root element where your app is rendered
);
