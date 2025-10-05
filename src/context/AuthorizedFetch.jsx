// // src/context/AuthorizedFetch.jsx
// import React, { createContext, useContext } from "react";
// import { useAuth } from "./AuthContext"; // assumes AuthContext.jsx is in same folder

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/VidyaSarthi";

// const ApiClientContext = createContext(null);

// /**
//  * ApiClientProvider - Provides `apiClient(path, options)` that always attaches
//  * the current Bearer token from auth context (or localStorage fallback).
//  */
// export const ApiClientProvider = ({ children }) => {
//   const auth = useAuth();

//   const getToken = () => {
//     // Prefer token from auth context
//     const tokenFromAuth = auth?.token;
//     if (tokenFromAuth) return tokenFromAuth;

//     // Fallback to persisted localStorage value (safe fallback)
//     try {
//       const stored = JSON.parse(localStorage.getItem("vidyaSarthiAuth") || "{}");
//       return stored?.token || null;
//     } catch (e) {
//       return null;
//     }
//   };

//   /**
//    * apiClient - wrapper around fetch.
//    * - path: string (e.g. "/faculty/uploadNews&Announcement")
//    * - options: fetch options (method, headers, body, etc)
//    *
//    * Note: this returns the raw Response object so calling code can check .ok, .json(), .text(), etc.
//    */
//   const apiClient = async (path, options = {}) => {
//     const token = getToken();

//     const mergedHeaders = {
//       ...(options.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };

//     const finalOptions = {
//       ...options,
//       headers: mergedHeaders,
//     };

//     // Ensure path begins with slash
//     const safePath = path.startsWith("/") ? path : `/${path}`;

//     const url = BASE_URL + safePath;

//     // return fetch response so caller handles it
//     return fetch(url, finalOptions);
//   };

//   return (
//     <ApiClientContext.Provider value={apiClient}>
//       {children}
//     </ApiClientContext.Provider>
//   );
// };

// export const useApiClient = () => {
//   const ctx = useContext(ApiClientContext);
//   if (!ctx) throw new Error("useApiClient must be used inside ApiClientProvider");
//   return ctx;
// };


// src/context/AuthorizedFetch.jsx
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/VidyaSarthi';
const ApiClientContext = createContext(null);

export const ApiClientProvider = ({ children }) => {
  const auth = useAuth();

  const getToken = () => {
    if (auth?.token) return auth.token;
    try {
      const stored = JSON.parse(localStorage.getItem('vidyaSarthiAuth') || '{}');
      return stored?.token || localStorage.getItem('token') || null;
    } catch (e) {
      return localStorage.getItem('token') || null;
    }
  };

  const apiClient = async (path, options = {}) => {
    const token = getToken();
    const mergedHeaders = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const finalOptions = {
      ...options,
      headers: mergedHeaders,
    };

    // ensure path begins with slash
    const safePath = path.startsWith('/') ? path : `/${path}`;
    const url = BASE_URL + safePath;

    return fetch(url, finalOptions);
  };

  return <ApiClientContext.Provider value={apiClient}>{children}</ApiClientContext.Provider>;
};

export const useApiClient = () => {
  const ctx = useContext(ApiClientContext);
  if (!ctx) throw new Error('useApiClient must be used inside ApiClientProvider');
  return ctx;
};
