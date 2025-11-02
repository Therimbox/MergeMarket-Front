import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Category from './Category';
import '../css/Category.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/productcategories')
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
