// src/components/Logout.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // adjust path if needed

/**
 * Logout component:
 * - calls auth.logout() to clear in-memory state
 * - clears persistent storage (handled by auth.logout)
 * - optionally calls backend logout endpoint
 * - closes modal, navigates to "/StudentSection"
 * - supports close on outside click and Escape key
 */

const LOGOUT_ENDPOINT = "http://localhost:8080/VidyaSarthi/logoutAcc"; // optional backend logout

const Logout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const auth = useAuth(); // get logout()

  // prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // close when clicking outside modal box
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    // Try backend logout (non-fatal)
    if (LOGOUT_ENDPOINT) {
      try {
        const token = localStorage.getItem("token") || (JSON.parse(localStorage.getItem("vidyaSarthiAuth") || "{}")?.token);
        await fetch(LOGOUT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      } catch (err) {
        console.warn("Backend logout failed (non-fatal):", err);
      }
    }

    // Clear in-memory and persistent auth via context
    try {
      if (auth && typeof auth.logout === "function") {
        auth.logout();
      } else {
        // fallback: clear storage directly if context not available
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("vidyaSarthiAuth");
        try { window.dispatchEvent(new CustomEvent('app:logout')); } catch (_) {}
      }
    } catch (err) {
      console.warn("Error calling auth.logout:", err);
    }

    // close modal and navigate to StudentSection
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  // src/components/Logout.jsx

// ... (rest of the component)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Logout
      </button>

      {isOpen && (
        <div
          // Backdrop: full screen, centered content
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onMouseDown={handleOverlayClick}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            // Modal box: centered within the flex container
             // Added 'p-8' for better padding and ensured 'max-w-md' for consistent size.
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl mx-4 " 
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h1 id="logout-title" className="text-2xl font-bold mb-3 text-center">Logout from your account</h1>
            <p className="text-center text-gray-600 mb-6">Are you sure you want to logout? You will be redirected.</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
