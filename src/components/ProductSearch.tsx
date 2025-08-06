import React, { useState } from 'react';
import { searchLiderProducts, LiderProduct, formatChileanPrice } from '../services/liderScraper';
import './ProductSearch.css';

export interface MenuProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  brand?: string;
  category?: string;
  quantity: number;
  store: string;
}

interface ProductSearchProps {
  onAddProduct: (product: MenuProduct) => void;
  allowDecimalQuantity?: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onAddProduct, allowDecimalQuantity = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LiderProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchLiderProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (productName: string, quantity: number) => {
    const newSelected = new Map(selectedProducts);
    const adjustedQuantity = allowDecimalQuantity 
      ? Math.max(0.1, parseFloat(quantity.toFixed(1)))
      : Math.max(1, Math.floor(quantity));
    if (adjustedQuantity > 0) {
      newSelected.set(productName, adjustedQuantity);
    } else {
      newSelected.delete(productName);
    }
    setSelectedProducts(newSelected);
  };

  const handleQuantityInputChange = (productName: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      const newSelected = new Map(selectedProducts);
      const adjustedQuantity = allowDecimalQuantity ? parseFloat(numValue.toFixed(1)) : Math.floor(numValue);
      newSelected.set(productName, adjustedQuantity);
      setSelectedProducts(newSelected);
    }
  };

  const handleAddProduct = (product: LiderProduct) => {
    const quantity = selectedProducts.get(product.name) || 1;
    const menuProduct: MenuProduct = {
      id: Date.now().toString() + Math.random(),
      name: product.name,
      price: product.price * quantity,
      unit: product.unit,
      brand: product.brand,
      category: product.category,
      quantity,
      store: product.store
    };
    
    onAddProduct(menuProduct);
    
    // Reset quantity for this product
    const newSelected = new Map(selectedProducts);
    newSelected.delete(product.name);
    setSelectedProducts(newSelected);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="product-search">
      <div className="search-section">
        <h3>Buscar Productos</h3>
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Buscar productos (ej: pollo, arroz, pan)..."
            className="search-input"
          />
          <button 
            onClick={handleSearch} 
            disabled={isLoading || !searchQuery.trim()}
            className="search-button"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="results-section">
          <h4>Resultados de búsqueda ({searchResults.length})</h4>
          <div className="products-grid">
            {searchResults.map((product, index) => {
              const quantity = selectedProducts.get(product.name) || 1;
              const totalPrice = product.price * quantity;
              
              return (
                <div key={`${product.name}-${index}`} className="product-card">
                  <div className="product-info">
                    <h5 className="product-name">{product.name}</h5>
                    {product.brand && (
                      <p className="product-brand">Marca: {product.brand}</p>
                    )}
                    <p className="product-store">🏪 {product.store}</p>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">
                      {formatChileanPrice(product.price)} / {product.unit}
                    </p>
                    
                    <div className="quantity-controls">
                      <label>Cantidad:</label>
                      <div className="quantity-input-group">
                        <button 
                          onClick={() => handleQuantityChange(product.name, quantity - (allowDecimalQuantity ? 0.1 : 1))}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={allowDecimalQuantity ? "0.1" : "1"}
                          step={allowDecimalQuantity ? "0.1" : "1"}
                          value={quantity}
                          onChange={(e) => handleQuantityInputChange(product.name, e.target.value)}
                          className="quantity-input"
                        />
                        <button 
                          onClick={() => handleQuantityChange(product.name, quantity + (allowDecimalQuantity ? 0.1 : 1))}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="total-price">
                      <strong>Total: {formatChileanPrice(totalPrice)}</strong>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAddProduct(product)}
                    className="add-product-btn"
                    disabled={!product.availability}
                  >
                    {product.availability ? 'Agregar al Menú' : 'No Disponible'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {searchQuery && searchResults.length === 0 && !isLoading && (
        <div className="no-results">
          <p>No se encontraron productos para "{searchQuery}"</p>
          <p>Intenta con términos como: pollo, arroz, pan, leche, huevos</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;