import React from 'react';
import Product from './Product';
import '../css/Product.css';

const ProductList = ({ products }) => {
    return (
        <div className="product-container">
            {products.filter(product => product.price > 0).map(product => (
                <Product
                    key={product.idProduct}
                    productId={product.idProduct}
                    name={product.name}
                    price={product.price}
                    web={product.web}
                    image={product.image}
                    categoryId={product.category.id}
                />
            ))}
        </div>
    );
};

export default ProductList;
