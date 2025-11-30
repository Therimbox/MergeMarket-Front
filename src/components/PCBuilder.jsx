import React, { useState, useEffect } from 'react';
import api from '../api';
import '../css/PCBuilder.css';

const PCBuilder = () => {
    const [categories, setCategories] = useState([]);
    const [components, setComponents] = useState({});
    const [selectedComponents, setSelectedComponents] = useState({});
    const [searchTerms, setSearchTerms] = useState({});
    const [showDropdown, setShowDropdown] = useState({});

    const categoryNameMap = {
        'PROCESADORES': 'Procesador',
        'TARJETAS_GRAFICAS': 'Tarjeta Gráfica',
        'PLACAS_BASE': 'Placa Base',
        'RAM': 'Memoria RAM'
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get('/api/productcategories');
            const filteredCategories = response.data.filter(cat => 
                ['PROCESADORES', 'TARJETAS_GRAFICAS', 'PLACAS_BASE', 'RAM'].includes(cat.name)
            );
            setCategories(filteredCategories);
            
            const initialSelected = {};
            const initialSearch = {};
            const initialDropdown = {};
            filteredCategories.forEach(cat => {
                initialSelected[cat.id] = null;
                initialSearch[cat.id] = '';
                initialDropdown[cat.id] = false;
            });
            setSelectedComponents(initialSelected);
            setSearchTerms(initialSearch);
            setShowDropdown(initialDropdown);
            
            loadComponents(filteredCategories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadComponents = async (categoriesList) => {
        try {
            const promises = categoriesList.map(category =>
                api.get(`/api/products/bycategory/${category.id}`)
            );
            
            const responses = await Promise.all(promises);
            const newComponents = {};
            
            categoriesList.forEach((category, index) => {
                newComponents[category.id] = responses[index].data;
            });
            
            setComponents(newComponents);
        } catch (error) {
            console.error('Error loading components:', error);
        }
    };

    const handleSelectComponent = (categoryId, product) => {
        setSelectedComponents(prev => ({
            ...prev,
            [categoryId]: product
        }));
        setSearchTerms(prev => ({
            ...prev,
            [categoryId]: product ? product.name : ''
        }));
        setShowDropdown(prev => ({
            ...prev,
            [categoryId]: false
        }));
    };

    const handleSearchChange = (categoryId, value) => {
        setSearchTerms(prev => ({
            ...prev,
            [categoryId]: value
        }));
        setShowDropdown(prev => ({
            ...prev,
            [categoryId]: true
        }));
        if (!value) {
            setSelectedComponents(prev => ({
                ...prev,
                [categoryId]: null
            }));
        }
    };

    const getFilteredProducts = (categoryId) => {
        const searchTerm = searchTerms[categoryId] || '';
        const productList = components[categoryId] || [];
        
        if (!searchTerm) {
            return productList;
        }
        
        return productList.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const calculateTotal = () => {
        return Object.values(selectedComponents).reduce((total, component) => {
            return total + (component ? component.price : 0);
        }, 0);
    };

    const resetConfiguration = () => {
        const resetSelected = {};
        const resetSearch = {};
        const resetDropdown = {};
        categories.forEach(cat => {
            resetSelected[cat.id] = null;
            resetSearch[cat.id] = '';
            resetDropdown[cat.id] = false;
        });
        setSelectedComponents(resetSelected);
        setSearchTerms(resetSearch);
        setShowDropdown(resetDropdown);
    };

    return (
        <div className="pc-builder-container">
            <h1>Configurador de PC</h1>
            <p className="builder-description">
                Selecciona los componentes para tu PC y calcula el precio total
            </p>

            <div className="builder-content">
                <div className="components-selection">
                    {categories.map(category => (
                        <div key={category.id} className="component-category">
                            <h2>{categoryNameMap[category.name]}</h2>
                            <div className="component-selector">
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        value={searchTerms[category.id] || ''}
                                        onChange={(e) => handleSearchChange(category.id, e.target.value)}
                                        onFocus={() => setShowDropdown(prev => ({ ...prev, [category.id]: true }))}
                                        placeholder="Buscar componente..."
                                        className="component-search-input"
                                    />
                                    {showDropdown[category.id] && getFilteredProducts(category.id).length > 0 && (
                                        <div className="search-dropdown">
                                            {getFilteredProducts(category.id).map(product => (
                                                <div
                                                    key={product.idProduct}
                                                    className="dropdown-item"
                                                    onClick={() => handleSelectComponent(category.id, product)}
                                                >
                                                    <span className="dropdown-name">{product.name}</span>
                                                    <span className="dropdown-price">{product.price.toFixed(2)}€</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {selectedComponents[category.id] && (
                                    <div className="selected-component-info">
                                        <div className="component-details">
                                            <img 
                                                src={selectedComponents[category.id].image} 
                                                alt={selectedComponents[category.id].name}
                                                className="component-image"
                                            />
                                            <div className="component-text">
                                                <p className="component-name">{selectedComponents[category.id].name}</p>
                                                <p className="component-price">{selectedComponents[category.id].price.toFixed(2)}€</p>
                                                {selectedComponents[category.id].web && (
                                                    <a 
                                                        href={selectedComponents[category.id].web} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="component-link"
                                                    >
                                                        Ver en tienda
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="build-summary">
                    <h2>Resumen de Configuración</h2>
                    <div className="summary-content">
                        {categories.map(category => (
                            selectedComponents[category.id] && (
                                <div key={category.id} className="summary-item">
                                    <span className="summary-category">{categoryNameMap[category.name]}:</span>
                                    <span className="summary-name">{selectedComponents[category.id].name}</span>
                                    <span className="summary-price">{selectedComponents[category.id].price.toFixed(2)}€</span>
                                </div>
                            )
                        ))}
                        
                        {Object.values(selectedComponents).some(c => c !== null) ? (
                            <>
                                <div className="summary-total">
                                    <span>TOTAL:</span>
                                    <span className="total-price">{calculateTotal().toFixed(2)}€</span>
                                </div>
                                <button onClick={resetConfiguration} className="reset-button">
                                    Reiniciar Configuración
                                </button>
                            </>
                        ) : (
                            <p className="no-components">No has seleccionado ningún componente</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PCBuilder;
