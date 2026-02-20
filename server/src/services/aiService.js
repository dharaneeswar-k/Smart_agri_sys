const predictPrice = (currentPrice, cropName, historicalData) => {
    const randomFactor = Math.random() * 0.2 - 0.1; 
    const predictedPrice = currentPrice * (1 + randomFactor);
    return {
        crop: cropName,
        currentPrice: currentPrice,
        predictedPriceNextWeek: Math.round(predictedPrice),
        trend: predictedPrice > currentPrice ? 'UP' : 'DOWN',
        confidence: '85%'
    };
};
const getSmartRecommendation = (currentPrice, predictedPrice, transportCost, storageCost) => {
    if (predictedPrice > currentPrice + storageCost) {
        return {
            action: 'STORE',
            reason: `Price expected to rise to ₹${predictedPrice}. Storing is profitable after costs.`
        };
    } else if (currentPrice > predictedPrice) {
        return {
            action: 'SELL_NOW',
            reason: 'Prices are likely to fall. Best to sell immediately.'
        };
    } else {
        return {
            action: 'TRANSPORT',
            reason: 'Consider transporting to a different market if prices are higher there.'
        };
    }
};
const forecastDemand = (cropName) => {
    const seasons = ['High', 'Moderate', 'Low'];
    return {
        crop: cropName,
        demandLevel: seasons[Math.floor(Math.random() * seasons.length)],
        growthPercentage: Math.floor(Math.random() * 20) + 5
    };
};
module.exports = { predictPrice, getSmartRecommendation, forecastDemand };
