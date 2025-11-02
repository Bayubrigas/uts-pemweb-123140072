// pages/Home/Home.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className="home">
      <div className="hero">
        <h1>
          Welcome to <br /> CryptoTracker
        </h1>
        <p>
          Welcome to the world's largest cryptocurrency marketplace. Sign up to
          explore more about cryptos.
        </p>
        <form>
          <input type="text" placeholder="Search Crypto.." />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="crypto-table">
        {/* Header Tabel */}
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24h%</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {/* Body Tabel dengan Link */}
        {displayCoin &&
          displayCoin.slice(0, 10).map((item, index) => (
            <Link
              to={`/coin/${item.id}`}
              key={index}
              className="table-row"styling klik
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {/* Rank */}
              <p>{item.market_cap_rank}</p>

              {/* Coin Info */}
              <div className="coin-info">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span className="symbol">{item.symbol.toUpperCase()}</span>
                </div>
              </div>

              {/* Price */}
              <p>
                {currency.symbol}
                {item.current_price.toLocaleString()}
              </p>

              {/* 24h Change */}
              <p
                style={{
                  color:
                    item.price_change_percentage_24h >= 0
                      ? "limegreen"
                      : "red",
                  textAlign: "center",
                }}
              >
                {item.price_change_percentage_24h.toFixed(2)}%
              </p>

              {/* Market Cap */}
              <p className="market-cap">
                {currency.symbol}
                {item.market_cap.toLocaleString()}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Home;