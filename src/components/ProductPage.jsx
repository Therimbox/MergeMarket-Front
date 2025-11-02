import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ProductList from './ProductList';
import '../css/Product.css';
import '../css/Search.css';

const ProductPage = () => {
    const { categoryId, name } = useParams();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterByBrand, setFilterByBrand] = useState(null);

    // Estados para controlar la visibilidad de los chipsets
    const [showIntelChipsets, setShowIntelChipsets] = useState(false);
    const [showAmdChipsets, setShowAmdChipsets] = useState(false);

    useEffect(() => {
        api.get(`/api/products/bycategory/${categoryId}`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [categoryId]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setFilterByBrand(null);
    };

    const handleBrandFilter = (brand) => {
        setSearchTerm(brand);
    };

    const handleClearFilter = () => {
        setSearchTerm('');
        setFilterByBrand(null);
        // Volver a cerrar ambos desplegables al limpiar el filtro
        setShowIntelChipsets(false);
        setShowAmdChipsets(false);
    };

    // Funciones para desplegar/ocultar chipsets
    const toggleIntelChipsets = () => {
        setShowIntelChipsets(!showIntelChipsets);
    };

    const toggleAmdChipsets = () => {
        setShowAmdChipsets(!showAmdChipsets);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="product-page-title">{name}</h1>

            {/* Buscador */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            {/* Filtros específicos para la categoría 3: Placas Base */}
            {categoryId === '3' && (
                <div className="filters-container">
                    {/* Botones para mostrar Intel y AMD */}
                    <div className="row">
                        <button className="filter-button" onClick={toggleIntelChipsets}>
                            Intel
                        </button>
                        <button className="filter-button" onClick={toggleAmdChipsets}>
                            AMD
                        </button>
                    </div>

                    

                    {/* Botón para limpiar los filtros */}
                    <div className="row">
                        <button className="filter-button" onClick={handleClearFilter}>
                            Limpiar filtro
                        </button>
                    </div>
                </div>
            )}

            {/* Chipsets Intel desplegables debajo de los botones */}
            {showIntelChipsets && (
                <div className="filters-container">
                    <button className="filter-button" onClick={() => handleBrandFilter('H510')}>H510</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('H610')}>H610</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('H670')}>H670</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('Z490')}>Z490</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('Z590')}>Z590</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('Z690')}>Z690</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('Z790')}>Z790</button>
                </div>
            )}

            {/* Chipsets AMD desplegables debajo de los botones */}
            {showAmdChipsets && (
                <div className="filters-container">
                    <button className="filter-button" onClick={() => handleBrandFilter('A320')}>A320</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('A520')}>A520</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('B450')}>B450</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('B550')}>B550</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('B650')}>B650</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('X570')}>X570</button>
                    <button className="filter-button" onClick={() => handleBrandFilter('X670')}>X670</button>
                </div>
            )}

            {/* Lista de productos filtrados */}
            <ProductList products={filteredProducts} />
        </div>
    );
};

export default ProductPage;
