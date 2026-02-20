const Warehouse = require('../models/Warehouse');
const asyncHandler = require('express-async-handler');
const getWarehouses = asyncHandler(async (req, res) => {
    const warehouses = await Warehouse.find({});
    res.json(warehouses);
});
const getNearbyWarehouses = asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;
    const distanceInMeters = 50000; 
    const warehouses = await Warehouse.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: distanceInMeters
            }
        }
    });
    res.json(warehouses);
});
const addWarehouse = asyncHandler(async (req, res) => {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json(warehouse);
});
module.exports = { getWarehouses, getNearbyWarehouses, addWarehouse };
