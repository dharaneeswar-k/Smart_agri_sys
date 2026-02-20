const axios = require('axios');
const CropPrice = require('../models/CropPrice');
const Market = require('../models/Market');
const DEFAULT_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
class MarketDataService {
    constructor() {
        this.apiKey = process.env.DATA_GOV_API_KEY;
        this.resourceId = process.env.DATA_GOV_RESOURCE_ID || DEFAULT_RESOURCE_ID;
        this.baseUrl = 'https://api.data.gov.in/resource/';
    }
    async fetchLivePrices() {
        if (!this.apiKey) {
            console.warn('Skipping live data sync: DATA_GOV_API_KEY not found in .env');
            return null;
        }
        console.log(`Using API Key: ${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}`);
        try {
            console.log(`Fetching live market data from Resource ID: ${this.resourceId}...`);
            const response = await axios.get(`${this.baseUrl}${this.resourceId}`, {
                params: {
                    'api-key': this.apiKey,
                    'format': 'json',
                    'limit': 100
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            if (response.data && response.data.records) {
                if (response.data.records.length > 0) {
                    console.log('Sample API Record:', JSON.stringify(response.data.records[0], null, 2));
                } else {
                    console.log('API returned 0 records. Response structure:', JSON.stringify(response.data, null, 2));
                }
                return response.data.records;
            } else {
                console.error('Invalid response format from data.gov.in', JSON.stringify(response.data, null, 2));
                return [];
            }
        } catch (error) {
            console.error('Error fetching live market data:', error.message);
            if (error.response) {
                console.error('API Error Response:', JSON.stringify(error.response.data, null, 2));
            }
            return [];
        }
    }
    async syncDatabase() {
        const records = await this.fetchLivePrices();
        if (!records || records.length === 0) return { success: false, message: 'No records fetched' };
        let addedCount = 0;
        for (const record of records) {
            if (record.market && record.commodity && record.modal_price) {
                const recordAdded = await this.processStandardRecord(record);
                if (recordAdded) addedCount++;
                continue;
            }
            const keys = Object.keys(record);
            const priceKeys = keys.filter(k => k.startsWith('wholesale_price_of_'));
            if (priceKeys.length > 0) {
                let recordAdded = false;
                for (const key of priceKeys) {
                    const priceVal = record[key];
                    if (!priceVal || priceVal === 'NP' || isNaN(parseFloat(priceVal))) continue;
                    const commodityRaw = key
                        .replace('wholesale_price_of_', '')
                        .replace('__in_rs___qtl__', '')
                        .replace('__in_rs__qtl_', '')
                        .replace(/_/g, ' ');
                    const commodityName = commodityRaw.charAt(0).toUpperCase() + commodityRaw.slice(1);
                    const marketName = record.district || record.state || 'Unknown Market';
                    const saved = await this.savePricePoint(marketName, commodityName, parseFloat(priceVal) / 100); 
                    if (saved) recordAdded = true;
                }
                if (recordAdded) addedCount++;
            }
        }
        console.log(`Synced ${addedCount} new price records from data.gov.in`);
        return { success: true, added: addedCount };
    }
    async savePricePoint(marketName, cropName, pricePerKg) {
        let marketDoc = await Market.findOne({ name: new RegExp(marketName, 'i') });
        if (!marketDoc) {
            marketDoc = await Market.create({
                name: marketName,
                location: {
                    type: 'Point',
                    coordinates: [78.9629, 20.5937], 
                    address: marketName 
                }
            });
        }
        const dateObj = new Date();
        dateObj.setHours(0, 0, 0, 0);
        const exists = await CropPrice.findOne({
            market: marketDoc._id,
            cropName: cropName,
            date: dateObj
        });
        if (!exists) {
            await CropPrice.create({
                market: marketDoc._id,
                cropName: cropName,
                variety: 'Common',
                pricePerKg: pricePerKg,
                date: dateObj
            });
            return true;
        }
        return false;
    }
    async processStandardRecord(record) {
        const { market, commodity, variety, modal_price, arrival_date } = record;
        const pricePerQuintal = parseFloat(modal_price);
        if (isNaN(pricePerQuintal)) return false;
        const pricePerKg = pricePerQuintal / 100;
        let dateObj = new Date();
        if (arrival_date) {
            const [day, month, year] = arrival_date.split('/');
            dateObj = new Date(`${year}-${month}-${day}`);
        }
        dateObj.setHours(0, 0, 0, 0); 
        let marketDoc = await Market.findOne({ name: new RegExp(market, 'i') });
        if (!marketDoc) {
            marketDoc = await Market.create({
                name: market,
                location: {
                    type: 'Point',
                    coordinates: [78.9629, 20.5937], 
                    address: record.district || record.state || 'India'
                }
            });
        }
        const exists = await CropPrice.findOne({
            market: marketDoc._id,
            cropName: commodity,
            date: dateObj
        });
        if (!exists) {
            await CropPrice.create({
                market: marketDoc._id,
                cropName: commodity,
                variety: variety || 'Common',
                pricePerKg: pricePerKg,
                date: dateObj
            });
            return true;
        }
        return false;
    }
}
module.exports = new MarketDataService();
