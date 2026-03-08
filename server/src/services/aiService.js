const CROP_DATA = {
    tomato: { seasonal: 0.12, baseVolatility: 0.18, peakMonths: [10, 11, 12, 1], demandBase: 85 },
    potato: { seasonal: 0.08, baseVolatility: 0.10, peakMonths: [11, 12, 1, 2], demandBase: 78 },
    onion: { seasonal: 0.15, baseVolatility: 0.22, peakMonths: [1, 2, 3, 10], demandBase: 88 },
    wheat: { seasonal: 0.05, baseVolatility: 0.07, peakMonths: [3, 4, 5], demandBase: 92 },
    rice: { seasonal: 0.06, baseVolatility: 0.08, peakMonths: [10, 11], demandBase: 90 },
    maize: { seasonal: 0.09, baseVolatility: 0.12, peakMonths: [9, 10, 11], demandBase: 75 },
    soybean: { seasonal: 0.07, baseVolatility: 0.10, peakMonths: [10, 11, 12], demandBase: 72 },
    pulses: { seasonal: 0.10, baseVolatility: 0.14, peakMonths: [1, 2, 11, 12], demandBase: 80 },
    cotton: { seasonal: 0.08, baseVolatility: 0.12, peakMonths: [10, 11, 12], demandBase: 82 },
};

const MARKET_SUFFIXES = ['APMC', 'Mandi', 'Market', 'Yard', 'Exchange'];
const CITIES = ['Delhi', 'Mumbai', 'Pune', 'Nagpur', 'Jaipur', 'Lucknow', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

const seededRand = (seed, min, max) => {
    const x = Math.sin(seed + 1) * 10000;
    const r = x - Math.floor(x);
    return min + r * (max - min);
};

const getCropProfile = (cropName) => {
    const key = cropName?.toLowerCase().trim();
    return CROP_DATA[key] || { seasonal: 0.10, baseVolatility: 0.15, peakMonths: [11, 12], demandBase: 75 };
};

const predictPrice = (currentPrice, cropName, historicalData) => {
    const cp = Number(currentPrice);
    const profile = getCropProfile(cropName);
    const month = new Date().getMonth() + 1;
    const inPeak = profile.peakMonths.includes(month);
    const seasonalBoost = inPeak ? profile.seasonal : -profile.seasonal * 0.5;
    const volatility = seededRand(cp * 0.37, -1, 1) * profile.baseVolatility;
    const trend = seasonalBoost + volatility;
    const predictedPriceNextWeek = Math.round(cp * (1 + trend));

    const forecast = [];
    for (let i = 1; i <= 7; i++) {
        const dayNoise = seededRand(cp * 0.13 + i * 7.3, -1, 1) * profile.baseVolatility * 0.6;
        const dayTrend = (trend / 7) * i + dayNoise;
        forecast.push(Math.round(cp * (1 + dayTrend)));
    }

    const confidence = Math.min(95, Math.max(70,
        Math.round(85 - profile.baseVolatility * 100 + (inPeak ? 5 : 0))
    ));

    return {
        crop: cropName,
        currentPrice: cp,
        predictedPriceNextWeek,
        trend: predictedPriceNextWeek > cp ? 'UP' : 'DOWN',
        confidence: `${confidence}%`,
        confidenceNum: confidence,
        forecastWeek: forecast,
        inPeakSeason: inPeak,
    };
};

const getTopMarkets = (cropName, basePrice, transportCost) => {
    const seed = (cropName || 'crop').charCodeAt(0) * 3 + (cropName || 'crop').length * 7;
    const tc = Number(transportCost) || 50;

    // City classifications for more realistic distances
    const TIER_1_CITIES = ['Delhi', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

    return [0, 1, 2].map(i => {
        const cityIdx = Math.floor(Math.abs(seededRand(seed + i * 17, 0, CITIES.length)));
        const suffixIdx = Math.floor(Math.abs(seededRand(seed + i * 11, 0, MARKET_SUFFIXES.length)));
        const city = CITIES[cityIdx % CITIES.length];
        const suffix = MARKET_SUFFIXES[suffixIdx % MARKET_SUFFIXES.length];

        // Dynamic distance based on city tier
        let dist;
        if (TIER_1_CITIES.includes(city)) {
            // Distant major hubs
            dist = Math.round(150 + Math.abs(seededRand(seed + i * 5, 0, 850)));
        } else if (i === 2) {
            // One market is always a local option
            dist = Math.round(5 + Math.abs(seededRand(seed + i * 5, 0, 25)));
        } else {
            // Regional markets
            dist = Math.round(30 + Math.abs(seededRand(seed + i * 5, 0, 170)));
        }

        const raw = seededRand(seed + i * 3, -0.05, 0.15); // Slightly better price potential
        const price = Math.round(Number(basePrice) * (1 + raw));
        const netGain = price - Number(basePrice) - tc;
        return { name: `${city} ${suffix}`, price, distance: dist, netGain };
    }).sort((a, b) => b.price - a.price);
};

const getSmartRecommendation = (currentPrice, predictedPrice, transportCost, storageCost, cropName) => {
    const cp = Number(currentPrice);
    const pp = Number(predictedPrice);
    const tc = Number(transportCost) || 50;
    const sc = Number(storageCost) || 20;
    const profile = getCropProfile(cropName);

    const potentialGain = pp - cp;           // gain if stored for a week
    const storageNet = potentialGain - sc;    // net after storage cost
    const sellNowNet = cp - tc;              // net after local transport
    const breakEven = cp + tc + sc;
    const netMargin = ((sellNowNet / cp) * 100).toFixed(1);
    const riskScore = Math.min(100, Math.round(profile.baseVolatility * 400 + (potentialGain < 0 ? 20 : 0)));
    const topMarkets = getTopMarkets(cropName, cp, tc);
    const bestMarket = topMarkets[0];
    const transportNet = bestMarket.price - cp - tc;  // net gain by transporting
    const month = new Date().getMonth() + 1;
    const inPeak = profile.peakMonths.includes(month);
    const optimalPrice = bestMarket.price;

    // ── Score each option by absolute net revenue per quintal ────────────
    const scores = {
        SELL_NOW: sellNowNet,
        STORE: storageNet > sellNowNet ? storageNet : -Infinity,
        TRANSPORT: transportNet > sellNowNet ? transportNet : -Infinity,
        PARTIAL_SELL: inPeak && storageNet > sellNowNet ? (storageNet * 0.5 + sellNowNet * 0.5) : -Infinity,
    };

    // Pick the action with the highest net score
    const winning = Object.entries(scores).reduce((best, [act, score]) =>
        score > best.score ? { act, score } : best,
        { act: 'SELL_NOW', score: scores.SELL_NOW }
    );
    const action = winning.act;
    const finalScore = winning.score;

    let reason, strategy;
    if (action === 'PARTIAL_SELL') {
        reason = `Hybrid strategy for peak season — sell 50% now at ₹${cp}/Qtl (net ₹${sellNowNet.toFixed(0)}/Qtl) and store the remainder. Projected price next week is ₹${pp}, giving ₹${storageNet.toFixed(0)} net gain after storage. This hedges your risk while capturing potential upside.`;
        strategy = 'Sell 50% today, store 50% for 7 days';
    } else if (action === 'STORE') {
        const gainOverLocal = storageNet - sellNowNet;
        reason = `Price is trending UP — ₹${pp} projected next week. After storage cost of ₹${sc}/Qtl, your net revenue is ₹${storageNet.toFixed(0)}/Qtl, which is ₹${gainOverLocal.toFixed(0)} more than selling locally now (₹${sellNowNet.toFixed(0)}). Hold your stock.`;
        strategy = `Store for 7 days. Target sell price: ₹${pp}/Qtl`;
    } else if (action === 'TRANSPORT') {
        const gainOverLocal = transportNet - sellNowNet;
        reason = `${bestMarket.name} is offering ₹${bestMarket.price}/Qtl — ₹${bestMarket.price - cp} more than local. Even with transport cost of ₹${tc}, your net revenue is ₹${transportNet.toFixed(0)}/Qtl, which is ₹${gainOverLocal.toFixed(0)} better than local selling. Worth the logistics.`;
        strategy = `Transport to ${bestMarket.name} (${bestMarket.distance}km away)`;
    } else {
        const lossAverted = sellNowNet - Math.max(storageNet, transportNet);
        reason = `Prices are projected to fall or other options haven't proven better. Local selling yields ₹${sellNowNet.toFixed(0)}/Qtl net. Storing or transporting would likely result in lower returns (approx ₹${lossAverted.toFixed(0)} less). Sell now to maximize profit.`;
        strategy = 'Sell at local market today';
    }

    const sellWindow = new Date();
    const endWindow = new Date();
    endWindow.setDate(endWindow.getDate() + (action === 'STORE' ? 7 : action === 'PARTIAL_SELL' ? 7 : 2));

    return {
        action,
        reason,
        strategy,
        riskScore,
        currentPrice: cp, // Essential for frontend gain calculations
        netMargin: parseFloat(netMargin),
        breakEven: Math.round(breakEven),
        optimalPrice,
        topMarkets,
        sellWindowStart: sellWindow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        sellWindowEnd: endWindow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    };
};

const forecastDemand = (cropName) => {
    const profile = getCropProfile(cropName);
    const month = new Date().getMonth() + 1;
    const inPeak = profile.peakMonths.includes(month);
    const levels = ['Very High', 'High', 'Moderate', 'Low'];
    const idx = inPeak ? 0 : Math.floor(Math.abs(seededRand((cropName || 'crop').length * 7, 0, 3)));
    return {
        crop: cropName,
        demandLevel: levels[Math.min(idx, 3)],
        growthPercentage: Math.round(profile.demandBase * (inPeak ? 1.1 : 0.85)),
    };
};

module.exports = { predictPrice, getSmartRecommendation, forecastDemand };
