import React from 'react';
import CategoryList from './CategoryList';
import '../css/HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            <h1>Componentes</h1>
            <CategoryList />
        </div>
    );
};

export default HomePage;
