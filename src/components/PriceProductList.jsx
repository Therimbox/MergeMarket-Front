import React, { useState, useEffect } from 'react';
import PriceProduct from './PriceProduct';
import { HiOutlineBell, HiMiniBellAlert } from "react-icons/hi2";
import api from '../api';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import '../css/PriceProduct.css';

const PriceProductList = ({ priceProducts, categoryId, productId, priceHistory }) => {
    const productName = priceProducts.length > 0 ? priceProducts[0].product.name : '';
    const productImage = priceProducts.length > 0 ? priceProducts[0].image : '';
    const showProductName = categoryId !== 2;

    const [isTracking, setIsTracking] = useState(false);
    const [visibleProducts, setVisibleProducts] = useState(3);

    useEffect(() => {
        const checkTracking = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };

                    const userResponse = await api.get(`/api/users/user`, config);
                    const userId = userResponse.data.id;
                    const trackingResponse = await api.get(`/api/users/${userId}/isTracking/${productId}`, config);
                    
                    setIsTracking(trackingResponse.data);
                }
            } catch (error) {
                console.error('Error checking tracking:', error);
            }
        };

        checkTracking();
    }, [productId]);

    const toggleTracking = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const userResponse = await api.get(`/api/users/user`, config);
                const userId = userResponse.data.id;

                if (isTracking) {
                    await api.delete(`/api/users/${userId}/deleteTrack/${productId}`, config);
                } else {
                    await api.post(`/api/users/${userId}/addTrack/${productId}`, {}, config);
                }
                setIsTracking(!isTracking);
            }
        } catch (error) {
            console.error('Error toggling tracking:', error);
        }
    };

    const loadMoreProducts = () => {
        setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 3);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            {/* Contenedor para el nombre del producto, imagen e icono de tracking */}
            <div className="product-header">
                {showProductName && <h2>{productName}</h2>}
                {showProductName && (
                    <img
                        src={productImage}
                        alt="Imagen"
                        onError={(e) => {
                            e.target.onerror = null; // Evita bucles infinitos
                            e.target.src = 'https://via.placeholder.com/150'; // Imagen genérica de respaldo
                        }}
                    />
                )}
                {isTracking ? (
                    <HiMiniBellAlert onClick={toggleTracking} className="tracking-icon" />
                ) : (
                    <HiOutlineBell onClick={toggleTracking} className="tracking-icon" />
                )}
            </div>

            {/* Contenedor que agrupa la lista de productos y la gráfica */}
            <div className="product-content">
                <div className="product-list">
                    <div className="price-product-items">
                        {priceProducts.slice(0, visibleProducts).map((priceProduct, index) => (
                            <div className="price-product-item" key={index}>
                                <PriceProduct
                                    name={priceProduct.name}
                                    price={priceProduct.price}
                                    url={priceProduct.url}
                                    lastDate={priceProduct.lastDate}
                                    image={priceProduct.image}
                                    categoryId={categoryId}
                                />
                            </div>
                        ))}
                    </div>
                    {visibleProducts < priceProducts.length && (
                        <div className="row">
                            <button class="centered-button" onClick={loadMoreProducts}>Cargar más resultados</button>
                        </div>
                    )}
                </div>
                
                {/* Gráfico de precios a la derecha */}
                {priceHistory.length > 0 && (
                    <div className="price-chart">
                        <LineChart width={400} height={300} data={priceHistory}>
                            <XAxis dataKey="timestamp" tickFormatter={formatDate} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" />
                        </LineChart>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceProductList;
