import React from 'react';
import '../css/PriceProduct.css';

const PriceProduct = ({ name, price, url, lastDate, image, categoryId }) => {
    const formatWebName = (webUrl) => {
        let url = webUrl.replace("https://", "");
        let parts = url.split("/");
        let webName = parts[0];
        webName = webName.replace("www.", "");
        webName = webName.replace(".com", "");
        webName = webName.charAt(0).toUpperCase() + webName.slice(1);
        return webName;
    };
    const formatWeb= formatWebName(url);
    const noShowProductName = categoryId == 2;
    const containsWifi = name.toLowerCase().includes('wifi');
    return (
        <div className="price-product">
            <a className="clickeable" href={url} target="_blank">
                <h3>{formatWeb}</h3>
                {/*noShowProductName && <img src={image} alt="Imagen" />*/}
                {noShowProductName && <h2>{name}</h2>}
                <p>Precio: {price}</p>
                {containsWifi && <p>Wifi</p>}
                <p>Última actualización: {new Date(lastDate).toLocaleString()}</p>
                {/* <p>Última actualización: {new Date(lastDate).toLocaleString()}</p> */}               
            </a>
        </div>
    );
};

export default PriceProduct;
