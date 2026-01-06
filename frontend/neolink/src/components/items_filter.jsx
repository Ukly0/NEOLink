import { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../api";

function ItemsFilter({ filters, onFilterChange, onClearFilters }) {
    const [categories, setCategories] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [ercPanels, setErcPanels] = useState([]);
    const [ercKeywords, setErcKeywords] = useState([]);

    const itemStatusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'running', label: 'Running' },
        { value: 'expired', label: 'Expired' }
    ];

    const ercAreaOptions = [
        { value: 'Life Sciences (LS)', label: 'Life Sciences (LS)' },
        { value: 'Physical Sciences and Engineering (PE)', label: 'Physical Sciences and Engineering (PE)' },
        { value: 'Social Sciences and Humanities (SH)', label: 'Social Sciences and Humanities (SH)' }
    ];

    useEffect(() => {
        loadFilterOptions();
    }, []);

    useEffect(() => {
        if (filters.erc_area) {
            loadErcPanels(filters.erc_area);
        } else {
            setErcPanels([]);
        }
    }, [filters.erc_area]);

    useEffect(() => {
        if (filters.erc_panel) {
            loadErcKeywords(filters.erc_panel);
        } else {
            setErcKeywords([]);
        }
    }, [filters.erc_panel]);

    const loadFilterOptions = async () => {
        try {
            const [categoriesRes, universitiesRes] = await Promise.all([
                axios.get(`${base_url}/item-categories`),
                axios.get(`${base_url}/universities`)
            ]);

            setCategories(categoriesRes.data.data || []);
            setUniversities(universitiesRes.data.data || []);
        } catch (err) {
            console.error("Error loading filter options:", err);
        }
    };

    const loadErcPanels = async (area) => {
        try {
            // Try different field name variations
            const response = await axios.get(
                `${base_url}/erc-panels?filters[erc_area][$eq]=${area}`
            );
            console.log("ERC Panels response:", response.data);
            setErcPanels(response.data.data || []);
        } catch (err) {
            console.error("Error loading ERC panels:", err);
        }
    };

    const loadErcKeywords = async (panelId) => {
        try {
            const response = await axios.get(
                `${base_url}/erc-keywords?filters[erc_panel][id][$eq]=${panelId}`
            );
            console.log("ERC Keywords response:", response.data);
            setErcKeywords(response.data.data || []);
        } catch (err) {
            console.error("Error loading ERC keywords:", err);
        }
    };

    const handleChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        
        // Reset dependent filters
        if (field === 'erc_area') {
            newFilters.erc_panel = '';
            newFilters.erc_keyword = '';
        }
        if (field === 'erc_panel') {
            newFilters.erc_keyword = '';
        }
        
        onFilterChange(newFilters);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        border: '2px solid #dee2e6',
        borderRadius: '8px',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: 'white',
        color: '#495057'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#495057'
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            position: 'sticky',
            top: '2rem'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#213547',
                    margin: 0
                }}>
                    Filters
                </h3>
                <button
                    onClick={onClearFilters}
                    style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'transparent',
                        color: '#7c6fd6',
                        border: '1px solid #7c6fd6',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#7c6fd6';
                        e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#7c6fd6';
                    }}
                >
                    Clear All
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Search */}
                <div>
                    <label style={labelStyle}>Search</label>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        placeholder="Search by name..."
                        style={inputStyle}
                    />
                </div>

                {/* Status */}
                <div>
                    <label style={labelStyle}>Status</label>
                    <select
                        value={filters.item_status}
                        onChange={(e) => handleChange('item_status', e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="">All Statuses</option>
                        {itemStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category */}
                <div>
                    <label style={labelStyle}>Category</label>
                    <select
                        value={filters.category_id}
                        onChange={(e) => handleChange('category_id', e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.attributes?.name || cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* University */}
                <div>
                    <label style={labelStyle}>University</label>
                    <select
                        value={filters.university}
                        onChange={(e) => handleChange('university', e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="">All Universities</option>
                        {universities.map(uni => (
                            <option key={uni.id} value={uni.id}>
                                {uni.attributes?.name || uni.university_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ERC Area */}
                <div>
                    <label style={labelStyle}>ERC Area</label>
                    <select
                        value={filters.erc_area}
                        onChange={(e) => handleChange('erc_area', e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="">All Areas</option>
                        {ercAreaOptions.map(area => (
                            <option key={area.value} value={area.value}>
                                {area.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ERC Panel */}
                <div>
                    <label style={labelStyle}>ERC Panel</label>
                    <select
                        value={filters.erc_panel}
                        onChange={(e) => handleChange('erc_panel', e.target.value)}
                        style={{
                            ...inputStyle,
                            cursor: filters.erc_area ? 'pointer' : 'not-allowed',
                            opacity: filters.erc_area ? 1 : 0.6
                        }}
                        disabled={!filters.erc_area}
                    >
                        <option value="">
                            {filters.erc_area ? 'All Panels' : 'Select area first'}
                        </option>
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
                        value={filters.erc_keyword}
                        onChange={(e) => handleChange('erc_keyword', e.target.value)}
                        style={{
                            ...inputStyle,
                            cursor: filters.erc_panel ? 'pointer' : 'not-allowed',
                            opacity: filters.erc_panel ? 1 : 0.6
                        }}
                        disabled={!filters.erc_panel}
                    >
                        <option value="">
                            {filters.erc_panel ? 'All Keywords' : 'Select panel first'}
                        </option>
                        {ercKeywords.map(keyword => (
                            <option key={keyword.id} value={keyword.id}>
                                {keyword.attributes?.name || keyword.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default ItemsFilter;