import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());


app.get('/api/search', async (req, res) => {
  const query = req.query.q || 'movie trailers';
  try {
    const YOUTUBE_API_KEY = import.meta.env.YOUTUBE_API_KEY;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 10,
        key: YOUTUBE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('YouTube API error (search):', error.message);
    res.status(500).json({ error: 'Failed to fetch from YouTube API' });
  }
});


app.get('/api/popular', async (req, res) => {
  const region = req.query.region || 'US';
  const maxResults = req.query.maxResults || 10;

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        regionCode: region,
        maxResults,
        key: import.meta.env.YOUTUBE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('YouTube API error (popular):', error.message);
    res.status(500).json({ error: 'Failed to fetch popular videos' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
