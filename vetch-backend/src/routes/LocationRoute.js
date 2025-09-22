const express = require('express');
const axios = require('axios');
const router = express.Router();

// router.get("/autocomplete", async (req, res) => {
//   try {
//     const { query } = req.query;
//     console.log(query);

//     if (!query) {
//       return res.status(400).json({ error: "Missing query parameter" });
//     }

//     const response = await axios.get(`${process.env.RADAR_BASE_URL}/search/autocomplete`, {
//       params: {
//         query
//       },
//       headers: {
//         Authorization: process.env.RADAR_API_KEY // Use your secret key
//       }
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Autocomplete request failed" });
//   }
// });

// GET /api/autocomplete?query=...&sessiontoken=...
router.get("/autocomplete", async (req, res) => {
  try {
    const { query, sessiontoken, language = "id", country = "ID" } = req.query;
    if (!query) return res.status(400).json({ error: "Missing query" });

    const { data } = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: query,
          key: process.env.GOOGLE_MAPS_API_KEY,
          language,
          components: `country:${country}`,
          sessiontoken, // <- forward the same token
        },
      }
    );

    const suggestions = (data.predictions || []).map((p) => ({
      label: p.description,
      placeId: p.place_id,
      mainText: p.structured_formatting?.main_text,
      secondaryText: p.structured_formatting?.secondary_text,
      types: p.types,
    }));

    res.json({ ok: true, suggestions });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({ error: "Autocomplete request failed" });
  }
});

// GET /api/place-details?placeId=...&sessiontoken=...
router.get("/place-details", async (req, res) => {
  try {
    const { placeId, sessiontoken, language = "id" } = req.query;
    if (!placeId) return res.status(400).json({ error: "Missing placeId" });

    const { data } = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_MAPS_API_KEY,
          language,
          sessiontoken, // <- same token finalizes the session
          fields: "formatted_address,geometry/location,address_component,place_id,name",
        },
      }
    );

    if (data.status !== "OK") return res.status(502).json({ error: data.status });

    const r = data.result;
    res.json({
      ok: true,
      placeId: r.place_id,
      name: r.name,
      formattedAddress: r.formatted_address,
      lat: r.geometry.location.lat,
      lng: r.geometry.location.lng,
      addressComponents: r.address_components,
    });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({ error: "Details request failed" });
  }
});


module.exports = router;