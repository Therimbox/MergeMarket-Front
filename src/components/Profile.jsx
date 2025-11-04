import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../css/Profile.css';
import ProductList from './ProductList';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [trackedProducts, setTrackedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token de autenticación no encontrado');
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const response = await api.get(`/api/users/user`, config);
                setUser(response.data);

                const trackedProductsResponse = await api.get(`/api/users/${response.data.id}/track`, config);
                setTrackedProducts(trackedProductsResponse.data);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user or tracked products:', error);
                setIsLoading(false);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="profile-container">
            {isLoggedIn && user ? (
                <div>
                    <h2>Perfil de Usuario</h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.role === 'admin' && (
                        <div className="admin-section">
                            <h3>Admin Actions</h3>
                            <Link to={`/scraping`} className='clickable'>
                                <button>Go to Scraping Tools</button>
                            </Link>
                            <button
                                onClick={async () => {
                                    const categoryId = 2;
                                    try {
                                        const token = localStorage.getItem('token');
                                        const config = {
                                            headers: { Authorization: `Bearer ${token}` },
                                        };
                                        await api.post(`/api/admin/reanalyze/${categoryId}`, {}, config);
                                        alert('Reanalysis for GPU category completed successfully.');
                                    } catch (error) {
                                        console.error('Error during reanalysis:', error);
                                        alert('An error occurred during reanalysis.');
                                    }
                                }}
                            >
                                Reanalyze GPU PriceProducts
                            </button>
                        </div>
                    )}
                    <h3>Productos en seguimiento</h3>
                    <ProductList products={trackedProducts} />
                </div>
            ) : (
                <p>No hay usuario logueado</p>
            )}
        </div>
    );
};

export default Profile;
