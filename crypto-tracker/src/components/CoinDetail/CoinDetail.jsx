import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CoinDetail.css';

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Converter states
  const [usdValue, setUsdValue] = useState(1);
  const [coinValue, setCoinValue] = useState(0);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        setCoin(data);
        setCoinValue(1 / data.market_data.current_price.usd);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching coin data:', err);
        setError(err.message || 'Gagal memuat data coin');
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  if (loading) return <div className="coin-detail"><div className="loading">⏳ Memuat data coin...</div></div>;
  if (error) return <div className="coin-detail error">❌ {error}</div>;
  if (!coin) return <div className="coin-detail error">🚫 Coin tidak ditemukan.</div>;

  const price = coin.market_data.current_price.usd;
  const change = coin.market_data.price_change_percentage_24h;
  const marketCap = coin.market_data.market_cap.usd;

  const formatNumber = (num) => num?.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const handleUsdChange = (e) => {
    const value = e.target.value;
    setUsdValue(value);
    setCoinValue(value / price);
  };

  const handleCoinChange = (e) => {
    const value = e.target.value;
    setCoinValue(value);
    setUsdValue(value * price);
  };

  return (
    <div className="coin-detail">
      {/* Header */}
      <div className="coin-header">
        <div className="coin-info">
          <img src={coin.image.large} alt={coin.name} className="coin-logo" />
          <div>
            <h1>{coin.name} <span className="symbol">{coin.symbol.toUpperCase()}</span></h1>
            <p className="rank">Rank #{coin.market_cap_rank}</p>
          </div>
        </div>
        <div className="follow-buy">
          <button className="btn follow">+ Follow</button>
          <button className="btn buy">Buy {coin.symbol.toUpperCase()}</button>
        </div>
      </div>

      {/* Main Info */}
      <div className="coin-stats">
        <div className="card">
          <h2>${formatNumber(price)}</h2>
          <p className={`change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}% (24h)
          </p>
        </div>
        <div className="card">
          <h3>Market Cap</h3>
          <p>${formatNumber(marketCap)}</p>
        </div>
        <div className="card">
          <h3>Volume 24h</h3>
          <p>${formatNumber(coin.market_data.total_volume.usd)}</p>
        </div>
        <div className="card">
          <h3>Supply</h3>
          <p>{formatNumber(coin.market_data.circulating_supply)} / {formatNumber(coin.market_data.total_supply)}</p>
        </div>
      </div>

      {/* Converter */}
      <div className="converter-card">
        <h2>💱 Converter</h2>
        <div className="converter-inputs">
          <div className="input-group">
            <label>USD</label>
            <input
              type="number"
              value={usdValue}
              onChange={handleUsdChange}
              step="0.01"
              min="0"
            />
          </div>
          <div className="input-group">
            <label>{coin.symbol.toUpperCase()}</label>
            <input
              type="number"
              value={coinValue}
              onChange={handleCoinChange}
              step="0.000001"
              min="0"
            />
          </div>
        </div>
        <p className="converter-rate">1 {coin.symbol.toUpperCase()} = ${formatNumber(price)}</p>
      </div>

      {/* Description */}
      <div className="description-card">
        <h2>About {coin.name}</h2>
        <p dangerouslySetInnerHTML={{ __html: coin.description.en?.split('. ')[0] + '.' }} />
      </div>
    </div>
  );
};

export default CoinDetail;
