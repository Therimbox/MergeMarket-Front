import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';
import '../css/Product.css';

const Product = ({ productId, name, price, web, image, categoryId }) => {
    const formatWebName = (webUrl) => {
        let url = webUrl.replace("https://", "");
        let parts = url.split("/");
        let webName = parts[0];
        webName = webName.replace("www.", "");
        webName = webName.replace(".com", "");
        webName = webName.charAt(0).toUpperCase() + webName.slice(1);
        return webName;
    };
    const formatWeb = formatWebName(web);

    return (
        <div className="product-card">
            <Link to={`/prices/${categoryId}/${productId}`} className='clickable'>
                <Card>
                    <div className="product-header">
                        <h2>{name}</h2>
                    </div>
                    <div className="product-body">
                        <img
                            src={image}
                            alt="Imagen"
                            onError={(e) => {
                                e.target.onerror = null; // Evita bucles infinitos
                                e.target.src = 'https://via.placeholder.com/150'; // Imagen genérica de respaldo
                            }}
                        />
                    </div>
                    <div className="product-info">
                        <p>{price}€ / {formatWeb}</p>
                    </div>
                </Card>
            </Link>
        </div>
    );
};

export default Product;
