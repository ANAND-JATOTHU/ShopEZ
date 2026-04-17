import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import '../components/ProductCard.css';
import './ProductsPage.css';

const CATEGORIES = ['mobiles', 'Electronics', 'Sports-Equipment', 'Fashion', 'Groceries'];
const GENDERS = ['Men', 'Women', 'Unisex'];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  );
  const [selectedGenders, setSelectedGenders] = useState([]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (selectedCategories.length === 1) params.category = selectedCategories[0];
      if (selectedGenders.length === 1) params.gender = selectedGenders[0];
      if (sortBy) params.sortBy = sortBy;
      const { data } = await fetchProducts(params);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, selectedCategories, selectedGenders, sortBy]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleGender = (g) => {
    setSelectedGenders((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="products-page-layout container">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <h3 className="filters-title">Filters</h3>

            {/* Sort By */}
            <div className="filter-section">
              <h4>Sort By</h4>
              {[
                { value: '', label: 'Popularity' },
                { value: 'price_asc', label: 'Price (low to high)' },
                { value: 'price_desc', label: 'Price (high to low)' },
                { value: 'discount', label: 'Discount' },
              ].map((opt) => (
                <label key={opt.value} className="filter-option">
                  <input
                    type="radio"
                    name="sortBy"
                    id={`sort-${opt.value || 'popularity'}`}
                    checked={sortBy === opt.value}
                    onChange={() => setSortBy(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {/* Categories */}
            <div className="filter-section">
              <h4>Categories</h4>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filter-option">
                  <input
                    type="checkbox"
                    id={`cat-filter-${cat}`}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            {/* Gender */}
            <div className="filter-section">
              <h4>Gender</h4>
              {GENDERS.map((g) => (
                <label key={g} className="filter-option">
                  <input
                    type="checkbox"
                    id={`gender-filter-${g}`}
                    checked={selectedGenders.includes(g)}
                    onChange={() => toggleGender(g)}
                  />
                  {g}
                </label>
              ))}
            </div>

            <button
              className="btn btn-outline btn-full"
              style={{ marginTop: '16px' }}
              onClick={() => { setSelectedCategories([]); setSelectedGenders([]); setSortBy(''); }}
            >
              Clear Filters
            </button>
          </aside>

          {/* Products Area */}
          <main className="products-main">
            <div className="products-header">
              <h2>
                {searchParams.get('search')
                  ? `Results for "${searchParams.get('search')}"`
                  : selectedCategories.length > 0
                  ? selectedCategories.join(', ')
                  : 'All Products'}
              </h2>
              <span className="product-count">{products.length} products</span>
            </div>

            {loading ? (
              <div className="spinner" />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductsPage;
