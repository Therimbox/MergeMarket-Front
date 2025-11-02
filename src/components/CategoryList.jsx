import React, { useState, useEffect } from 'react';
import api from '../api';
import Category from './Category';
import '../css/Category.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/api/productcategories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <div className="category-container">
            {categories.length > 0 ? (
                categories.map(category => (
                    <Category 
                        key={category.id} 
                        categoryId={category.id} 
                        title={category.name}
                        image={category.image}
                    />
                ))
            ) : (
                <p>Cargando categorías...</p>
            )}
        </div>
    );
};

export default CategoryList;
