import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routing/Router";
ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={routes} />

);
