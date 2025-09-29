import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routing/Router";
// import { AuthProvider } from "./context/AuthContext";
import { AuthProvider } from "./auth/AuthContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={routes} />
  </AuthProvider>
  // <AuthProvider>
  //   <RouterProvider router={routes} />
  // </AuthProvider>
  
);
