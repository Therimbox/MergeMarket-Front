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
    const [sortOrder, setSortOrder] = useState(null); // Estado para el orden de los precios

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
        if (!showIntelChipsets) {
            setShowAmdChipsets(false); // Ocultar AMD si Intel se despliega
        }
    };

    const toggleAmdChipsets = () => {
        setShowAmdChipsets(!showAmdChipsets);
        if (!showAmdChipsets) {
            setShowIntelChipsets(false); // Ocultar Intel si AMD se despliega
        }
    };

    const getButtonClass = (isActive) => {
        return `filter-button ${isActive ? 'active' : ''}`;
    };

    const handleSortOrder = (order) => {
        setSortOrder(order);
    };

    // Filtro especial para gráficas
    const getGraphicsFilter = () => {
        if (categoryId !== '2') return null;
        if (searchTerm === 'NVIDIA') {
            return product => {
                const name = product.name.toLowerCase();
                return name.includes('rtx') || name.includes('gtx') || name.includes('gt') || name.includes('geforce');
            };
        }
        if (searchTerm === 'AMD') {
            return product => {
                const name = product.name.toLowerCase();
                return name.includes('rx') || name.includes('radeon');
            };
        }
        return null;
    };

    const filteredAndSortedProducts = [...products]
        .filter(product => {
            if (categoryId === '2') {
                const graphicsFilter = getGraphicsFilter();
                if (graphicsFilter) return graphicsFilter(product);
            }
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.price - b.price;
            } else if (sortOrder === 'desc') {
                return b.price - a.price;
            }
            return 0;
        });

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

            {/* Filtros de ordenación */}
            <div className="filters-container">
                <button className="filter-button" onClick={() => handleSortOrder('asc')}>
                    Ordenar por precio: Ascendente
                </button>
                <button className="filter-button" onClick={() => handleSortOrder('desc')}>
                    Ordenar por precio: Descendente
                </button>
            </div>

            {/* Filtros específicos para la categoría 1: Procesadores */}
            {categoryId === '1' && (
                <div className="filters-container">
                    <div className="row">
                        <button className={getButtonClass(searchTerm === 'Intel')} onClick={() => handleBrandFilter('Intel')}>
                            Intel
                        </button>
                        <button className={getButtonClass(searchTerm === 'AMD')} onClick={() => handleBrandFilter('AMD')}>
                            AMD
                        </button>
                    </div>
                    <div className="row">
                        <button className="filter-button" onClick={handleClearFilter}>
                            Limpiar filtro
                        </button>
                    </div>
                </div>
            )}

            {/* Filtros específicos para la categoría 2: Tarjetas Gráficas */}
            {categoryId === '2' && (
                <div className="filters-container">
                    <div className="row">
                        <button className={getButtonClass(searchTerm === 'NVIDIA')} onClick={() => handleBrandFilter('NVIDIA')}>
                            NVIDIA
                        </button>
                        <button className={getButtonClass(searchTerm === 'AMD')} onClick={() => handleBrandFilter('AMD')}>
                            AMD
                        </button>
                    </div>
                    <div className="row">
                        <button className="filter-button" onClick={handleClearFilter}>
                            Limpiar filtro
                        </button>
                    </div>
                </div>
            )}

            {/* Filtros específicos para la categoría 3: Placas Base */}
            {categoryId === '3' && (
                <div className="filters-container">
                    {/* Botones para mostrar Intel y AMD */}
                    <div className="row">
                        <button className={getButtonClass(showIntelChipsets)} onClick={toggleIntelChipsets}>
                            Intel
                        </button>
                        <button className={getButtonClass(showAmdChipsets)} onClick={toggleAmdChipsets}>
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
                    <button
                        className={getButtonClass(searchTerm === 'H510')}
                        onClick={() => handleBrandFilter('H510')}
                    >
                        H510
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'H610')}
                        onClick={() => handleBrandFilter('H610')}
                    >
                        H610
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'H810')}
                        onClick={() => handleBrandFilter('H810')}
                    >
                        H810
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'H670')}
                        onClick={() => handleBrandFilter('H670')}
                    >
                        H670
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'H770')}
                        onClick={() => handleBrandFilter('H770')}
                    >
                        H770
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'B860')}
                        onClick={() => handleBrandFilter('B860')}
                    >
                        B860
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'B760')}
                        onClick={() => handleBrandFilter('B760')}
                    >
                        B760
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'Z490')}
                        onClick={() => handleBrandFilter('Z490')}
                    >
                        Z490
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'Z590')}
                        onClick={() => handleBrandFilter('Z590')}
                    >
                        Z590
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'Z690')}
                        onClick={() => handleBrandFilter('Z690')}
                    >
                        Z690
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'Z790')}
                        onClick={() => handleBrandFilter('Z790')}
                    >
                        Z790
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'Z890')}
                        onClick={() => handleBrandFilter('Z890')}
                    >
                        Z890
                    </button>
                </div>
            )}

            {/* Chipsets AMD desplegables debajo de los botones */}
            {showAmdChipsets && (
                <div className="filters-container">
                    <button
                        className={getButtonClass(searchTerm === 'A320')}
                        onClick={() => handleBrandFilter('A320')}
                    >
                        A320
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'A520')}
                        onClick={() => handleBrandFilter('A520')}
                    >
                        A520
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'A620')}
                        onClick={() => handleBrandFilter('A620')}
                    >
                        A620
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'B450')}
                        onClick={() => handleBrandFilter('B450')}
                    >
                        B450
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'B550')}
                        onClick={() => handleBrandFilter('B550')}
                    >
                        B550
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'B650')}
                        onClick={() => handleBrandFilter('B650')}
                    >
                        B650
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'B840')}
                        onClick={() => handleBrandFilter('B840')}
                    >
                        B840
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'B850')}
                        onClick={() => handleBrandFilter('B850')}
                    >
                        B850
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'X570')}
                        onClick={() => handleBrandFilter('X570')}
                    >
                        X570
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'X670')}
                        onClick={() => handleBrandFilter('X670')}
                    >
                        X670
                    </button>
                    <button
                        className={getButtonClass(searchTerm === 'X870')}
                        onClick={() => handleBrandFilter('X870')}
                    >
                        X870
                    </button>
                </div>
            )}

            {/* Lista de productos filtrados y ordenados */}
            <ProductList products={filteredAndSortedProducts} />
        </div>
    );
};

export default ProductPage;
