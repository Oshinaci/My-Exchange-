// === TradingView Chart ===
new TradingView.widget({
  "width": "100%",
  "height": "100%",
  "symbol": "BINANCE:BTCUSDT",
  "interval": "60",
  "timezone": "Etc/UTC",
  "theme": "dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#111",
  "enable_publishing": false,
  "hide_legend": false,
  "container_id": "chart"
});

// === Update Price Live ===
async function updatePrice() {
  const res = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT");
  const data = await res.json();
  const priceEl = document.getElementById("price");
  const price = parseFloat(data.lastPrice).toFixed(2);
  const change = parseFloat(data.priceChangePercent).toFixed(2);
  priceEl.textContent = `$${price} (${change}%)`;
  priceEl.style.color = change >= 0 ? "#0f0" : "#f00";
}

// === Update Order Book ===
async function updateOrderBook() {
  const res = await fetch("https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10");
  const data = await res.json();
  const tbody = document.getElementById("orderbook");
  tbody.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const bid = data.bids[i] ? parseFloat(data.bids[i][0]).toFixed(2) : "";
    const ask = data.asks[i] ? parseFloat(data.asks[i][0]).toFixed(2) : "";
    tbody.innerHTML += `<tr><td style="color:#0f0">${bid}</td><td style="color:#f00">${ask}</td></tr>`;
  }
}

// === Update Trade History ===
async function updateTrades() {
  const res = await fetch("https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=30");
  const data = await res.json();
  const tbody = document.getElementById("trades");
  tbody.innerHTML = "";
  data.reverse().forEach(trade => {
    const price = parseFloat(trade.price).toFixed(2);
    const qty = parseFloat(trade.qty).toFixed(4);
    const time = new Date(trade.time).toLocaleTimeString();
    const color = trade.isBuyerMaker ? "#f00" : "#0f0";
    tbody.innerHTML += `<tr><td style="color:${color}">${price}</td><td>${qty}</td><td>${time}</td></tr>`;
  });
}

// === Auto Update Every 3s ===
setInterval(() => {
  updatePrice();
  updateOrderBook();
  updateTrades();
}, 3000);

// First load
updatePrice();
updateOrderBook();
updateTrades();
