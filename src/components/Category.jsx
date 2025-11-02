import React from 'react';
import { Card } from 'primereact/card';
import '../css/Category.css';
import { Link } from 'react-router-dom';

const Category = ({ categoryId, title, image }) => {
    const formatCategoryTitle = (title) => {
        return title.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };
    const formattedTitle = formatCategoryTitle(title);

    return (
        <div className="category-card">
            <Link to={`/category/${categoryId}/${formattedTitle}`} className='clickeable'>
                <Card>
                    <div className="category-header">
                        <h2>{formattedTitle}</h2>
                    </div>
                    <div className="category-body">
                        <img src={image} alt="Imagen" />
                    </div>
                </Card>
            </Link>
        </div>
    );
};

export default Category;
