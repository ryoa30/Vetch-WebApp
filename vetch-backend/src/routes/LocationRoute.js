const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get("/autocomplete", async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);

    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const response = await axios.get(`${process.env.RADAR_BASE_URL}/search/autocomplete`, {
      params: {
        query
      },
      headers: {
        Authorization: process.env.RADAR_API_KEY // Use your secret key
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Autocomplete request failed" });
  }
});

router.get('/province', getLocation = async (req, res) =>{
    try {
        const result = await fetch("https://wilayah.id/api/provinces.json");
        const data = await result.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
})

router.get('/regencies/:province_code', getLocation = async (req, res) =>{
    try {
        const { province_code } = req.params;
        const result = await fetch(`https://wilayah.id/api/regencies/${province_code}.json`);
        const data = await result.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
})

router.get('/districts/:regency_code', getLocation = async (req, res) =>{
    try {
        const { regency_code } = req.params;
        const result = await fetch(`https://wilayah.id/api/districts/${regency_code}.json`);
        const data = await result.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
})

router.get('/villages/:district_code', getLocation = async (req, res) =>{
    try {
        const { district_code } = req.params;
        const result = await fetch(`https://wilayah.id/api/villages/${district_code}.json`);
        const data = await result.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
})

module.exports = router;