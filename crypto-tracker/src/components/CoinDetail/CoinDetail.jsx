import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import './CoinDetail.css';

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Converter state
  const [usdValue, setUsdValue] = useState(1);
  const [coinValue, setCoinValue] = useState(0);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const [coinRes, chartRes] = await Promise.all([
          fetch(
            `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true`
          ),
          fetch(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
          ),
        ]);

        if (!coinRes.ok || !chartRes.ok) throw new Error('Gagal memuat data');

        const coinData = await coinRes.json();
        const chartData = await chartRes.json();

        setCoin(coinData);
        setChartData(
          chartData.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            price,
          }))
        );

        setCoinValue(1 / coinData.market_data.current_price.usd);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Gagal memuat data koin.');
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

      {/* Price Info */}
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

      {/* Chart Section */}
      <div className="chart-card">
        <h2>7-Day Price Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a2f55" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              stroke="#aaa"
            />
            <Tooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{ backgroundColor: '#1d152f', borderRadius: '10px', color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#7927ff"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
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
