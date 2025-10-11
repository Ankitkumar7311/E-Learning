import React, { useEffect, useState } from 'react';

// FIXED: Get token from the correct localStorage key
const getTokenFromLocalStorage = () => {
    try {
        const token = localStorage.getItem('token');
        return token || null;
    } catch (e) {
        console.error('Error getting token:', e);
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
    const [message, setMessage] = useState(null);

    const API_BASE = apiBase || 'http://localhost:8080/VidyaSarthi';

    // Function to fetch the Material (Blob)
    const fetchMaterialForPreview = async (id) => {
        setLoadingPreview(true);
        setPreviewError(null);
        setFileUrl(null);
        setFileType(null);
        setMessage(null);

        let currentFileUrl = null;

        const token = getTokenFromLocalStorage();
        if (!token) {
            setPreviewError('Authorization token not found for preview.');
            setLoadingPreview(false);
            return;
        }

        console.log('📡 Fetching material preview for:', id);

        try {
            const res = await fetch(`${API_BASE}/getMaterial/${encodeURIComponent(id)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('📡 Preview response status:', res.status);

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
            
            if (contentType.includes('application/pdf')) {
                type = 'pdf';
            } else if (contentType.includes('image/')) {
                type = 'image';
            } else if (contentType.includes('word') || contentType.includes('document')) {
                type = 'word';
            }
            
            console.log('✅ Material preview loaded. Type:', type);
            
            setFileType(type);
            setFileUrl(url);
            
            if (type !== 'pdf') {
                setMessage(`Warning: Current file is a ${type.toUpperCase()}. Only PDF files can be uploaded using the replacement field below.`);
            }
            
            return currentFileUrl;

        } catch (err) {
            console.error('❌ Failed to fetch material for preview', err);
            setPreviewError(err.message || 'Failed to load preview.');
        } finally {
            setLoadingPreview(false);
        }
    };

    useEffect(() => {
        let cleanupUrl = null;

        if (materialId) {
            fetchMaterialForPreview(materialId).then(url => {
                if (url) {
                   cleanupUrl = url; 
                }
            }).catch(() => {
                // Errors handled in fetchMaterialForPreview
            });
        }

        return () => {
            if (cleanupUrl) {
                URL.revokeObjectURL(cleanupUrl);
            }
        };
    }, [materialId, API_BASE]);

    const handleFileSelect = (e) => {
        const f = e.target.files && e.target.files[0];
        setSelectedFile(f);
        if (f) {
            if (f.type === 'application/pdf') {
                 setMessage(null);
            } else {
                 setMessage('Please select a PDF file. The input field is restricted to PDF.');
            }
        } else {
            if (fileType !== 'pdf') {
                setMessage(`Warning: Current file is a ${fileType.toUpperCase()}. Only PDF files can be uploaded using the replacement field below.`);
            } else {
                setMessage(null);
            }
        }
    };

    const handleReplace = async () => {
        if (!selectedFile) {
            setMessage('Please select a PDF to upload for replacement.');
            return;
        }

        if (selectedFile.type !== 'application/pdf') {
              setMessage('Upload failed: Please select a PDF file.');
              return;
        }

        setUploading(true);
        setMessage(null);

        console.log('📤 Uploading replacement material...');

        try {
            const formData = new FormData();
            formData.append('materialId', materialId);
            formData.append('pdf', selectedFile, selectedFile.name); 

            const token = getTokenFromLocalStorage();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_BASE}/faculty/editUploadedMaterial`, {
                method: 'POST',
                headers,
                body: formData,
            });

            console.log('📡 Upload response status:', res.status);

            if (!res.ok) {
                let text = `Upload failed with status ${res.status}`;
                try {
                    const json = await res.json();
                    if (json?.message) text = json.message;
                } catch (_) {}
                throw new Error(text);
            }

            await res.text();
            console.log('✅ Material replaced successfully');
            setMessage('Material replaced successfully.');

            setSelectedFile(null);
            setFilename(selectedFile.name); 
            
            if (typeof onReload === 'function') onReload();
            fetchMaterialForPreview(materialId); 

        } catch (err) {
            console.error('❌ Replace failed', err);
            setMessage(err.message || 'Replace failed');
        } finally {
            setUploading(false);
        }
    };
    
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
        
        const previewStyle = { width: '100%', maxWidth: 640, height: '480px', border: '1px solid #e5e7eb' };

        if (fileType === 'pdf') {
            return (
                <div style={previewStyle} className="w-full">
                    <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                    >
                        <div className="text-center p-4">
                            <svg className="mx-auto h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 4h7v5h5v11H6V4z" />
                            </svg>
                            <p className="mt-2 text-sm font-semibold text-blue-700">Click to View PDF</p>
                        </div>
                    </a>
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
                <div className="w-full flex flex-col items-center justify-center h-48 bg-yellow-50 border border-dashed border-yellow-200 text-yellow-800 p-4 text-center">
                    <p className='font-medium'>
                        Preview not available for **{filename}** ({fileDescription}). 
                    </p>
                    <a href={fileUrl} download={filename} className="text-blue-600 underline mt-2">Click to Download</a>
                </div>
            );
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-2">
                    <h2 className="text-xl font-semibold text-gray-800">Replace Material File</h2>
                    <button 
                        className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors w-full sm:w-auto" 
                        onClick={onBack}
                    >
                        Back to Selection
                    </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
                    <div className="mb-3 text-sm text-gray-600">Material ID: <strong>{materialId}</strong></div>
                    <div className="mb-4 text-sm text-gray-700">Current Filename: <strong>{filename}</strong></div>

                    <div className="w-full flex justify-center mb-4 overflow-hidden rounded-lg">
                        {renderPreview()}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Replace / Upload New PDF</label>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                            <input 
                                accept="application/pdf" 
                                type="file" 
                                onChange={handleFileSelect} 
                                className="block w-full sm:w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                            <button 
                                onClick={handleReplace} 
                                disabled={uploading || !selectedFile || selectedFile.type !== 'application/pdf'} 
                                className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-60 transition-colors duration-300 w-full sm:w-auto"
                            >
                                {uploading ? 'Uploading...' : 'Upload Replacement'}
                            </button>
                        </div>
                        {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected: <strong>{selectedFile.name}</strong></p>}
                        
                        {message && (
                            <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-700' : (message.includes('Warning') ? 'text-yellow-600' : 'text-red-600')}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editmaterialedit;