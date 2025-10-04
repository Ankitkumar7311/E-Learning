import React, { useState, useEffect } from 'react';
import logo from '../../assets/Ellipse.png';
import Editmaterialedit from './Editmaterialedit';

// safe API base detection (CRA/Vite/fallback)
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

// Helper to get faculty ID from localStorage (based on your description)
const getFacultyId = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('vidyaSarthiAuth') || '{}');
    return stored?.facultyId || null; // Assuming 'facultyId' is stored here
  } catch (e) {
    return null;
  }
};

// --- NEW HELPER: Get Token from localStorage ---
const getTokenFromLocalStorage = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('vidyaSarthiAuth') || '{}');
    return stored?.token || null;
  } catch (e) {
    return null;
  }
};
// ----------------------------------------------


const EditMaterial = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [materialId, setMaterialId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [materialList, setMaterialList] = useState([]); 
  const [selectedMaterialName, setSelectedMaterialName] = useState(''); 

  const facultyId = getFacultyId();

  // Function to fetch the list of materials
  const fetchMaterialList = async (id) => {
    if (!id) {
      setError('Faculty ID not found. Please log in again.');
      return;
    }
    
    // --- Get Token ---
    const token = getTokenFromLocalStorage();
    if (!token) {
        setError('Authorization token not found. Please log in.');
        return;
    }
    // -----------------

    setLoading(true);
    setError(null);
    setMaterialList([]);

    try {
      const res = await fetch(`${API_BASE}/faculty/getMaterialListFaculty/${encodeURIComponent(id)}`, {
        // --- Add Authorization Header ---
        headers: {
            'Authorization': `Bearer ${token}`, // Passing the token here
            'Content-Type': 'application/json'
        },
        // --------------------------------
      });

      if (!res.ok) {
        let msg = `Server responded with status ${res.status}`;
        try {
          const json = await res.json();
          if (json && json.message) msg = json.message;
        } catch (e) { /* ignore */ }
        
        // Handle 401 specifically
        if (res.status === 401) {
             msg = "Authentication failed (401). Token might be expired or invalid.";
        }
        
        throw new Error(msg);
      }

      const list = await res.json();
      setMaterialList(list || []);

    } catch (err) {
      console.error('Failed to fetch material list', err);
      setError(err.message || 'Failed to fetch material list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyId) {
      fetchMaterialList(facultyId);
    } else {
      setError('Faculty ID not available.');
    }
  }, [facultyId]); 

  const handleEditClick = () => {
    if (!materialId) {
      setError('Please select a material to edit.');
      return;
    }
    setShowEdit(true);
  };

  const handleDropdownChange = (e) => {
    const selectedId = e.target.value;
    setMaterialId(selectedId);
    setError(null);

    const material = materialList.find(m => m.materialId === selectedId);
    setSelectedMaterialName(material ? material.pdfName : '');
  };

  const handleBack = () => {
    setShowEdit(false);
    setMaterialId('');
    setSelectedMaterialName('');
  };

  const handleReload = () => {
    fetchMaterialList(facultyId);
  };

  return (
    <>
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        {!showEdit ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Uploaded Material</h2>
            {facultyId && <p className="mb-4 text-sm text-gray-600">Faculty ID: <strong>{facultyId}</strong></p>}
            
            {loading ? (
              <p className="text-blue-500">Loading material list...</p>
            ) : error && !materialList.length ? (
                <p className="text-sm text-red-600 mb-4">{error}</p>
            ) : (
                <>
                  <select
                    value={materialId}
                    onChange={handleDropdownChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 text-gray-800"
                    disabled={materialList.length === 0}
                  >
                    <option value="">-- Select Material --</option>
                    {materialList.map((m) => (
                      <option key={m.materialId} value={m.materialId}>
                        {m.pdfName}
                      </option>
                    ))}
                  </select>

                  {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

                  <button
                    className="w-full py-2 font-bold text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    onClick={handleEditClick}
                    disabled={!materialId || loading}
                  >
                    Edit Selected Material
                  </button>
                </>
            )}

            <div className="mt-4">
              <img src={logo} alt="logo" className="w-12 h-12 mx-auto" />
            </div>
          </div>
        ) : (
          <Editmaterialedit
            materialId={materialId}
            selectedMaterialName={selectedMaterialName} 
            onBack={handleBack}
            onReload={handleReload}
            apiBase={API_BASE}
            facultyId={facultyId} 
          />
        )}
      </main>
    </>
  );
};

export default EditMaterial;