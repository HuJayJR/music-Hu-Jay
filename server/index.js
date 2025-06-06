const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data for testing
const mockSongs = [
    {
        id: 1,
        title: "Test Song",
        artist: "Test Artist",
        url: "/assets/audio/test.mp3",
        coverImage: "/assets/images/placeholder-album.jpg"
    }
];

// Search endpoint
app.get('/api/search', (req, res) => {
    try {
        const query = req.query.q?.toLowerCase();
        if (!query) {
            return res.json([]);
        }

        const results = mockSongs.filter(song => 
            song.title.toLowerCase().includes(query) || 
            song.artist.toLowerCase().includes(query)
        );
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});