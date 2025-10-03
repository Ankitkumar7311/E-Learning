// src/modules/faculty/EditMaterialPage.jsx
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Editmaterialedit from '../../admin/Editmaterialedit';

const EditMaterialPage = () => {
    const { materialId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const selectedMaterialName = location.state?.selectedMaterialName || 'N/A';
    const apiBase = location.state?.apiBase || undefined;

    const handleBack = () => navigate(-1);
    const handleReload = () => {
        // Simple approach: go back and let previous page read location.state.reload if needed
        navigate(-1, { state: { reload: Date.now() } });
    };

    return (
        <Editmaterialedit
            materialId={materialId}
            selectedMaterialName={selectedMaterialName}
            onBack={handleBack}
            onReload={handleReload}
            apiBase={apiBase}
        />
    );
};

export default EditMaterialPage;
