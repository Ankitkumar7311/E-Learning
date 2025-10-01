import React, { useEffect, useState } from 'react';
import { useApiClient } from '../../context/AuthorizedFetch';

// Helper function to get token (copied from EditMaterial.jsx for consistency)
const getTokenFromLocalStorage = () => {
    try {
        const stored = JSON.parse(localStorage.getItem('vidyaSarthiAuth') || '{}');
        return stored?.token || null;
    } catch (e) {
        return null;
    }
};

const Editmaterialedit = ({ materialId, selectedMaterialName, onBack, onReload, apiBase }) => {
    const [fileUrl, setFileUrl] = useState(null); 
    const [fileType, setFileType] = useState(null); 
    const [filename, setFilename] = useState(selectedMaterialName || 'N/A');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(true); 
    const [previewError, setPreviewError] = useState(null);    
    const [message, setMessage] = useState(null); // This state will hold the general warning/success message

    let apiClient = null;
    try {
        apiClient = useApiClient();
    } catch (e) {
        apiClient = null;
    }

    const API_BASE = apiBase || 'http://localhost:8080/VidyaSarthi';

    // --- Function to fetch the Material (Blob) ---
    const fetchMaterialForPreview = async (id) => {
        setLoadingPreview(true);
        setPreviewError(null);
        setFileUrl(null);
        setFileType(null);
        setMessage(null); // Clear previous message before new fetch

        let currentFileUrl = null;

        const token = getTokenFromLocalStorage();
        if (!token) {
            setPreviewError('Authorization token not found for preview.');
            setLoadingPreview(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/getMaterial/${encodeURIComponent(id)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                let msg = `Failed to fetch material preview: Server responded with status ${res.status}`;
                try {
                    const json = await res.json();
                    if (json && json.message) msg = json.message;
                } catch (e) { /* ignore non-JSON error */ }
                throw new Error(msg);
            }

            const contentType = res.headers.get('content-type') || '';
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            currentFileUrl = url;
            
            let type = 'unknown';
            
            // Logic to check multiple MIME TYPES
            if (contentType.includes('application/pdf')) {
                type = 'pdf';
            } else if (contentType.includes('image/')) {
                type = 'image';
            } else if (contentType.includes('word') || contentType.includes('document')) {
                type = 'word';
            }
            
            setFileType(type);
            setFileUrl(url);
            
            // --- NEW LOGIC: Set warning message if file is not PDF ---
            if (type !== 'pdf') {
                setMessage(`Warning: Current file is a ${type.toUpperCase()}. Only PDF files can be uploaded using the replacement field below.`);
            }
            // --------------------------------------------------------
            
            return currentFileUrl; // Return URL for cleanup tracking

        } catch (err) {
            console.error('Failed to fetch material for preview', err);
            setPreviewError(err.message || 'Failed to load preview.');
        } finally {
            setLoadingPreview(false);
        }
    };
    // ----------------------------------------------------

    // --- useEffect to fetch on mount/materialId change ---
    useEffect(() => {
        let cleanupUrl = null;

        if (materialId) {
            fetchMaterialForPreview(materialId).then(url => {
                if (url) {
                   cleanupUrl = url; 
                }
            }).catch(() => {
                // Fetch errors are handled inside fetchMaterialForPreview
            });
        }

        return () => {
            if (cleanupUrl) {
                URL.revokeObjectURL(cleanupUrl);
            }
        };
    }, [materialId, API_BASE]);
    // -----------------------------------------------------

    const handleFileSelect = (e) => {
        const f = e.target.files && e.target.files[0];
        setSelectedFile(f);
        if (f) {
            // Clear general message only if selection is valid and a PDF (to avoid overwriting file type warning)
            if (f.type === 'application/pdf') {
                 setMessage(null);
            } else {
                 setMessage('Please select a PDF file. The input field is restricted to PDF.');
            }
        } else {
            // Re-show the original warning if the user clears the selection
            if (fileType !== 'pdf') {
                setMessage(`Warning: Current file is a ${fileType.toUpperCase()}. Only PDF files can be uploaded using the replacement field below.`);
            } else {
                setMessage(null);
            }
        }
    };

    // (handleReplace function remains the same as previously defined)
    const handleReplace = async () => {
        if (!selectedFile) {
            setMessage('Please select a PDF to upload for replacement.');
            return;
        }

        // Double check client-side mime type before upload
        if (selectedFile.type !== 'application/pdf') {
             setMessage('Upload failed: Please select a PDF file.');
             return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('materialId', materialId);
            formData.append('pdf', selectedFile, selectedFile.name); 

            const token = getTokenFromLocalStorage();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            let res;

            if (apiClient) {
                res = await apiClient('/faculty/editUploadedMaterial', {
                    method: 'POST',
                    body: formData,
                });
            } else {
                res = await fetch(`${API_BASE}/faculty/editUploadedMaterial`, {
                    method: 'POST',
                    headers,
                    body: formData,
                });
            }

            if (!res.ok) {
                let text = `Upload failed with status ${res.status}`;
                try {
                    const json = await res.json();
                    if (json?.message) text = json.message;
                } catch (_) {}
                throw new Error(text);
            }

            await res.text();
            setMessage('Material replaced successfully.');

            setSelectedFile(null);
            
            setFilename(selectedFile.name); 
            if (typeof onReload === 'function') onReload();
            
            fetchMaterialForPreview(materialId); 

        } catch (err) {
            console.error('Replace failed', err);
            setMessage(err.message || 'Replace failed');
        } finally {
            setUploading(false);
        }
    };
    
    // --- Function to render the correct preview element (unchanged) ---
    const renderPreview = () => {
        if (loadingPreview) {
            return (
                <div className="w-full flex items-center justify-center h-48 bg-gray-50 border border-dashed border-gray-200 text-gray-500">
                    Loading preview...
                </div>
            );
        }

        if (previewError || !fileUrl) {
            const displayError = previewError || 'No file content received.';
            return (
                <div className="w-full flex items-center justify-center h-48 bg-red-50 border border-dashed border-red-200 text-red-700 p-4 text-center">
                    <p className='font-medium'>Preview Error:</p> {displayError}
                </div>
            );
        }
        
        const previewStyle = { width: '100%', maxWidth: 640, height: 480, border: '1px solid #e5e7eb' };

        if (fileType === 'pdf') {
            return (
                <div style={previewStyle}>
                    <iframe 
                        src={fileUrl} 
                        type="application/pdf" 
                        width="100%" 
                        height="100%"
                        title={`PDF Preview for ${materialId}`}
                        allow="fullscreen" 
                        style={{ border: 'none' }}
                    >
                        <p className="p-4 text-gray-700">PDF preview not available. <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open in new tab</a></p>
                    </iframe>
                </div>
            );
        } 
        
        if (fileType === 'image') {
            return (
                <div style={{ ...previewStyle, height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img 
                        src={fileUrl} 
                        alt="Material Preview" 
                        className="max-w-full max-h-96 object-contain" 
                        style={{ maxHeight: '450px' }}
                    />
                </div>
            );
        }
        
        if (fileType === 'word' || fileType === 'unknown') {
            const fileDescription = fileType === 'word' ? 'Word Document' : 'Unknown Type';
            return (
                <div className="w-full flex items-center justify-center h-48 bg-yellow-50 border border-dashed border-yellow-200 text-yellow-800 p-4 text-center">
                    <p className='font-medium'>
                        Preview not available for **{filename}** ({fileDescription}). 
                        <a href={fileUrl} download={filename} className="text-blue-600 underline ml-2">Click to Download</a>
                    </p>
                </div>
            );
        }
    };
    // ----------------------------------------------------


    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Replace Material File</h2>
                <div className="flex gap-2">
                    <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" onClick={onBack}>Back to Selection</button>
                </div>
            </div>

            <div className="border border-gray-200 rounded p-4 mb-6">
                <div className="mb-3 text-sm text-gray-600">Material ID: <strong>{materialId}</strong></div>
                <div className="mb-4 text-sm text-gray-700">Current Filename: <strong>{filename}</strong></div>

                <div className="w-full flex justify-center mb-4">
                    {renderPreview()}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Replace / Upload New PDF</label>
                    <div className="flex gap-3 items-center">
                        <input 
                            accept="application/pdf" 
                            type="file" 
                            onChange={handleFileSelect} 
                            className="block" 
                        />
                        <button 
                            onClick={handleReplace} 
                            disabled={uploading || !selectedFile || selectedFile.type !== 'application/pdf'} 
                            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-60"
                        >
                            {uploading ? 'Uploading...' : 'Upload Replacement'}
                        </button>
                    </div>
                    {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected: <strong>{selectedFile.name}</strong></p>}
                    
                    {/* Display message/warning */}
                    {message && (
                        <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-700' : (message.includes('Warning') ? 'text-yellow-600' : 'text-red-600')}`}>
                            {message}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    {/* Edit Metadata button removed */}
                </div>
            </div>
        </div>
    );
};

export default Editmaterialedit;