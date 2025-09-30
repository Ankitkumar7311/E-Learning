// import React from "react"; 
// import ReactDOM from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import "./index.css";
// import routes from "./routing/Router";
// // import { AuthProvider } from "./context/AuthContext";
// import { AuthProvider } from "./auth/AuthContext"; 

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//   <AuthProvider>
//     <ApiClientProvider>
//     <RouterProvider router={routes} />
//     </ApiClientProvider>
//   </AuthProvider>
//   </React.StrictMode>
//   // <AuthProvider>
//   //   <RouterProvider router={routes} />
//   // </AuthProvider>
  
// );


// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routing/Router";

import { AuthProvider } from "./auth/AuthContext";

// Robust import for ApiClientProvider: accept named export or default export
import * as ApiClientModule from "./context/AuthorizedFetch"; // adjust path if needed

// Resolve provider: prefer named export, then default, otherwise fallback to passthrough
const ApiClientProvider =
  ApiClientModule?.ApiClientProvider || ApiClientModule?.default || (({ children }) => <>{children}</>);

// Helpful warning if not exported correctly
if (!ApiClientModule?.ApiClientProvider && !ApiClientModule?.default) {
  // eslint-disable-next-line no-console
  console.warn(
    "Warning: ApiClientProvider was not found as a named export or default export from ./context/AuthorizedFetch. Falling back to a passthrough provider. If you expect ApiClientProvider to be available, check the file's exports and path."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ApiClientProvider>
        <RouterProvider router={routes} />
      </ApiClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
