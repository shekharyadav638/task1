import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filter, setfilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        setfilter(data.slice(0, limit));
        setIdx(limit);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    if (idx < products.length && !loading) {
      setLoading(true);
      setTimeout(() => {
        setfilter((prev) => [...prev, ...products.slice(idx, idx + limit)]);
        setIdx((prevIdx) => prevIdx + limit);
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [idx, loading]);

  return (
    <div className="container">
      <h1>All Products</h1>
      <div>
        {filter.map((product) => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <p>Price: Rs.{product.price}</p>
          </div>
        ))}
      </div>
      {loading && <h3>Loading more products...</h3>}
    </div>
  );
};

export default Home;
