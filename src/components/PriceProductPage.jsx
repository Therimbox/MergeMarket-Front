import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PriceProductList from './PriceProductList';
import '../css/PriceProduct.css';

const PriceProductsPage = () => {
  const { categoryId, productId } = useParams();
  const [priceProducts, setPriceProducts] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/priceproducts/byproduct/${productId}`)
      .then(response => {
        setPriceProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching price products:', error);
      });

    axios.get(`http://localhost:8080/api/priceHistory/byProductId/${productId}`)
      .then(response => {
        setPriceHistory(response.data);
      })
      .catch(error => {
        console.error('Error fetching price history:', error);
      });
  }, [productId]);

  return (
    <div className="price-product-page">
      {priceProducts.length > 0 && (
        <PriceProductList priceProducts={priceProducts} categoryId={categoryId} productId={productId} priceHistory={priceHistory} />
      )}
    </div>
  );
};

export default PriceProductsPage;
