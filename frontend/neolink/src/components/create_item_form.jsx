import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { base_url } from "../api";

const logo_neolaia = "/logoNEOLAiA.png";
const eu_logo = "/eu_logo.png";
const logo_neolink = "/logo.png";

function CreateItemForm({ token }) {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        item_status: 'draft',
        name: '',
        description: '',
        category_id: '',
        expiration: '',
        isced_code: '',
        erc_panel: '',
        erc_keyword: '',
        start_date: '',
        learning_outcomes: '',
        multimediarial_material_provided: '',
        end_date: '',
        languages: '',
        speakers: '',
        pedagogical_objectives: '',
        level_of_study: '',
        university: '',
        first_level_structure: '',
        second_level_structure: '',
        offered_by: '',
        cover: null
    });

    // Dropdown options from database
    const [universities, setUniversities] = useState([]);
    const [firstLevelStructures, setFirstLevelStructures] = useState([]);
    const [secondLevelStructures, setSecondLevelStructures] = useState([]);
    const [ercPanels, setErcPanels] = useState([]);
    const [ercKeywords, setErcKeywords] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Item status options
    const itemStatusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
    ];

    // Format name to title case
    const formatName = (name) => {
        if (!name) return '';
        return name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    useEffect(() => {
        const initializeForm = async () => {
            try {
                // Decode token to get user data
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);
                setUserData(decoded);

                // Load dropdown data from API
                const [
                    universitiesRes,
                    firstLevelRes,
                    secondLevelRes,
                    ercPanelsRes,
                    ercKeywordsRes,
                    categoriesRes
                ] = await Promise.all([
                    axios.get(`${base_url}/universities`),
                    axios.get(`${base_url}/first-level-structures`),
                    axios.get(`${base_url}/second-level-structures`),
                    axios.get(`${base_url}/erc-panels`),
                    axios.get(`${base_url}/erc-keywords`),
                    axios.get(`${base_url}/item-categories`)
                ]);

                console.log("Universities:", universitiesRes.data);
                console.log("First Level:", firstLevelRes.data);
                console.log("Second Level:", secondLevelRes.data);

                setUniversities(universitiesRes.data.data || universitiesRes.data || []);
                setFirstLevelStructures(firstLevelRes.data.data || firstLevelRes.data || []);
                setSecondLevelStructures(secondLevelRes.data.data || secondLevelRes.data || []);
                setErcPanels(ercPanelsRes.data.data || ercPanelsRes.data || []);
                setErcKeywords(ercKeywordsRes.data.data || ercKeywordsRes.data || []);
                setCategories(categoriesRes.data.data || categoriesRes.data || []);

                // Pre-fill form with token data - try multiple possible field names
                const universityId = decoded.university_id || decoded.university || decoded.universityId || '';
                const firstLevelId = decoded.first_level_structure_id || decoded.first_level_structure || decoded.firstLevelStructure || '';
                const secondLevelId = decoded.second_level_structure_id || decoded.second_level_structure || decoded.secondLevelStructure || '';
                const fullName = decoded.full_name || decoded.fullName || decoded.name || '';

                console.log("Pre-filling with:", { universityId, firstLevelId, secondLevelId, fullName });

                setFormData(prev => ({
                    ...prev,
                    university: universityId,
                    first_level_structure: firstLevelId,
                    second_level_structure: secondLevelId,
                    offered_by: fullName ? formatName(fullName) : ''
                }));

                setLoading(false);
            } catch (err) {
                console.error("Error initializing form:", err);
                setError("Failed to load form data. Please try again.");
                setLoading(false);
            }
        };

        if (token) {
            initializeForm();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            cover: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            
            // Add user_id from token
            const decoded = jwtDecode(token);
            const userId = decoded.sub || decoded.id || decoded.user_id || decoded.userId;
            
            console.log("Submitting with user_id:", userId);
            submitData.append('data[user_id]', userId);
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    if (key === 'cover' && formData[key]) {
                        submitData.append('files.cover', formData[key]);
                    } else if (key !== 'cover') {
                        submitData.append(`data[${key}]`, formData[key]);
                    }
                }
            });

            // Log what we're sending
            console.log("Form data being sent:");
            for (let pair of submitData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await axios.post(
                `${base_url}/items`,
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log("Response:", response.data);
            setSuccess(true);
            setSubmitting(false);
            
            // Reset form after 2 seconds
            setTimeout(() => {
                setSuccess(false);
                const universityId = userData?.university_id || userData?.university || '';
                const firstLevelId = userData?.first_level_structure_id || userData?.first_level_structure || '';
                const secondLevelId = userData?.second_level_structure_id || userData?.second_level_structure || '';
                const fullName = userData?.full_name || userData?.fullName || userData?.name || '';
                
                setFormData({
                    item_status: 'draft',
                    name: '',
                    description: '',
                    category_id: '',
                    expiration: '',
                    isced_code: '',
                    erc_panel: '',
                    erc_keyword: '',
                    start_date: '',
                    learning_outcomes: '',
                    multimediarial_material_provided: '',
                    end_date: '',
                    languages: '',
                    speakers: '',
                    pedagogical_objectives: '',
                    level_of_study: '',
                    university: universityId,
                    first_level_structure: firstLevelId,
                    second_level_structure: secondLevelId,
                    offered_by: fullName ? formatName(fullName) : '',
                    cover: null
                });
            }, 2000);

        } catch (err) {
            console.error("Error submitting form:", err);
            console.error("Error response:", err.response?.data);
            setError(err.response?.data?.error?.message || "Failed to create item. Please try again.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '3rem',
                        height: '3rem',
                        border: '0.3rem solid #f3f3f3',
                        borderTop: '0.3rem solid #7c6fd6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }}></div>
                    <p style={{ marginTop: '1rem', color: '#6c757d' }}>Loading form...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            
            {/* Header */}
            <div style={{
                padding: '1rem 0',
                borderBottom: '1px solid #dee2e6',
                backgroundColor: 'white',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 1.5rem',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                            src={logo_neolink} 
                            alt='Logo NEOLink' 
                            style={{ maxHeight: '50px', height: 'auto' }}
                        />
                    </div>
                    <img 
                        src={eu_logo} 
                        alt='Logo EU' 
                        style={{ maxHeight: '45px', height: 'auto' }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div style={{ 
                flex: 1,
                padding: '2rem 1rem',
                maxWidth: '1000px',
                width: '100%',
                margin: '0 auto'
            }}>
                {success && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#d1e7dd',
                        border: '1px solid #badbcc',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        color: '#0f5132'
                    }}>
                        ✓ Item created successfully!
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c2c7',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        color: '#842029'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: '2rem'
                }}>
                    <h2 style={{ 
                        marginBottom: '2rem',
                        color: '#213547',
                        fontSize: '1.75rem',
                        fontWeight: '600'
                    }}>
                        Create New Item
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* Item Status */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                Item Status <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <select
                                name="item_status"
                                value={formData.item_status}
                                onChange={handleInputChange}
                                required
                                style={selectStyle}
                            >
                                {itemStatusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                Name <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                style={inputStyle}
                                placeholder="Enter item name"
                            />
                        </div>

                        {/* Offered By (Pre-filled from token) */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                Inserted by <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="offered_by"
                                value={formData.offered_by}
                                onChange={handleInputChange}
                                required
                                style={{
                                    ...inputStyle,
                                    backgroundColor: '#f8f9fa'
                                }}
                                placeholder="Instructor/Professor name"
                            />
                            <small style={{ 
                                display: 'block',
                                marginTop: '0.25rem',
                                fontSize: '0.85rem',
                                color: '#6c757d'
                            }}>
                                Pre-filled from your profile. You can edit if needed.
                            </small>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                style={textareaStyle}
                                placeholder="Enter item description"
                            />
                        </div>

                        {/* Category */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                Category <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                required
                                style={selectStyle}
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.attributes?.name || cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Two Column Layout */}
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            {/* Start Date */}
                            <div>
                                <label style={labelStyle}>Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    style={inputStyle}
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label style={labelStyle}>End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleInputChange}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Expiration Date */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Expiration Date</label>
                            <input
                                type="date"
                                name="expiration"
                                value={formData.expiration}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </div>

                        {/* ISCED Code */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>ISCED Code</label>
                            <input
                                type="text"
                                name="isced_code"
                                value={formData.isced_code}
                                onChange={handleInputChange}
                                style={inputStyle}
                                placeholder="Enter ISCED code"
                            />
                        </div>

                        {/* ERC Panel and Keyword */}
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            {/* ERC Panel */}
                            <div>
                                <label style={labelStyle}>ERC Panel</label>
                                <select
                                    name="erc_panel"
                                    value={formData.erc_panel}
                                    onChange={handleInputChange}
                                    style={selectStyle}
                                >
                                    <option value="">Select ERC Panel</option>
                                    {ercPanels.map(panel => (
                                        <option key={panel.id} value={panel.id}>
                                            {panel.attributes?.name || panel.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ERC Keyword */}
                            <div>
                                <label style={labelStyle}>ERC Keyword</label>
                                <select
                                    name="erc_keyword"
                                    value={formData.erc_keyword}
                                    onChange={handleInputChange}
                                    style={selectStyle}
                                >
                                    <option value="">Select ERC Keyword</option>
                                    {ercKeywords.map(keyword => (
                                        <option key={keyword.id} value={keyword.id}>
                                            {keyword.attributes?.name || keyword.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Learning Outcomes */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Learning Outcomes</label>
                            <textarea
                                name="learning_outcomes"
                                value={formData.learning_outcomes}
                                onChange={handleInputChange}
                                rows={3}
                                style={textareaStyle}
                                placeholder="Enter learning outcomes"
                            />
                        </div>

                        {/* Multimedia Material */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Multimedia Material Provided</label>
                            <textarea
                                name="multimediarial_material_provided"
                                value={formData.multimediarial_material_provided}
                                onChange={handleInputChange}
                                rows={3}
                                style={textareaStyle}
                                placeholder="Describe multimedia materials"
                            />
                        </div>

                        {/* Languages */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Languages</label>
                            <input
                                type="text"
                                name="languages"
                                value={formData.languages}
                                onChange={handleInputChange}
                                style={inputStyle}
                                placeholder="e.g., English, Spanish, French"
                            />
                        </div>

                        {/* Speakers */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Speakers</label>
                            <input
                                type="text"
                                name="speakers"
                                value={formData.speakers}
                                onChange={handleInputChange}
                                style={inputStyle}
                                placeholder="Enter speaker names"
                            />
                        </div>

                        {/* Pedagogical Objectives */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Pedagogical Objectives</label>
                            <textarea
                                name="pedagogical_objectives"
                                value={formData.pedagogical_objectives}
                                onChange={handleInputChange}
                                rows={3}
                                style={textareaStyle}
                                placeholder="Enter pedagogical objectives"
                            />
                        </div>

                        {/* Level of Study */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Level of Study</label>
                            <input
                                type="text"
                                name="level_of_study"
                                value={formData.level_of_study}
                                onChange={handleInputChange}
                                style={inputStyle}
                                placeholder="e.g., Undergraduate, Graduate"
                            />
                        </div>

                        {/* University (Pre-filled) */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                University <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <select
                                name="university"
                                value={formData.university}
                                onChange={handleInputChange}
                                required
                                style={{
                                    ...selectStyle,
                                    backgroundColor: '#f8f9fa'
                                }}
                            >
                                <option value="">Select university</option>
                                {universities.map(uni => (
                                    <option key={uni.id} value={uni.id}>
                                        {uni.attributes?.name || uni.name}
                                    </option>
                                ))}
                            </select>
                            <small style={{ 
                                display: 'block',
                                marginTop: '0.25rem',
                                fontSize: '0.85rem',
                                color: '#6c757d'
                            }}>
                                Pre-filled from your profile
                            </small>
                        </div>

                        {/* First Level Structure (Pre-filled) */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>First Level Structure</label>
                            <select
                                name="first_level_structure"
                                value={formData.first_level_structure}
                                onChange={handleInputChange}
                                style={{
                                    ...selectStyle,
                                    backgroundColor: '#f8f9fa'
                                }}
                            >
                                <option value="">Select first level structure</option>
                                {firstLevelStructures.map(struct => (
                                    <option key={struct.id} value={struct.id}>
                                        {struct.attributes?.name || struct.name}
                                    </option>
                                ))}
                            </select>
                            <small style={{ 
                                display: 'block',
                                marginTop: '0.25rem',
                                fontSize: '0.85rem',
                                color: '#6c757d'
                            }}>
                                Pre-filled from your profile
                            </small>
                        </div>

                        {/* Second Level Structure (Pre-filled) */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Second Level Structure</label>
                            <select
                                name="second_level_structure"
                                value={formData.second_level_structure}
                                onChange={handleInputChange}
                                style={{
                                    ...selectStyle,
                                    backgroundColor: '#f8f9fa'
                                }}
                            >
                                <option value="">Select second level structure</option>
                                {secondLevelStructures.map(struct => (
                                    <option key={struct.id} value={struct.id}>
                                        {struct.attributes?.name || struct.name}
                                    </option>
                                ))}
                            </select>
                            <small style={{ 
                                display: 'block',
                                marginTop: '0.25rem',
                                fontSize: '0.85rem',
                                color: '#6c757d'
                            }}>
                                Pre-filled from your profile
                            </small>
                        </div>

                        {/* Cover Image */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={labelStyle}>Cover Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    ...inputStyle,
                                    padding: '0.5rem'
                                }}
                            />
                            {formData.cover && (
                                <p style={{ 
                                    marginTop: '0.5rem',
                                    fontSize: '0.9rem',
                                    color: '#6c757d'
                                }}>
                                    Selected: {formData.cover.name}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div style={{ 
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                style={{
                                    padding: '0.75rem 2rem',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#5a6268';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#6c757d';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: submitting 
                                        ? '#9b8fd6' 
                                        : 'linear-gradient(135deg, #7c6fd6 0%, #8b7ad6 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 2px 4px rgba(124, 111, 214, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(124, 111, 214, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 4px rgba(124, 111, 214, 0.2)';
                                }}
                            >
                                {submitting ? 'Creating...' : 'Create Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Styles
const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#495057'
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: 'white',
    color: '#495057'
};

const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    fontFamily: 'inherit'
};

const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
};

export default CreateItemForm;