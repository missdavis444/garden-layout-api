const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Plant icon library (SVG paths for common plants)
const plantIcons = {
    // Vegetables
    'tomato': '<circle cx="50" cy="40" r="15" fill="#FF6B6B" stroke="#E53E3E" stroke-width="2"/><circle cx="45" cy="45" r="8" fill="#FF8E8E"/><path d="M50 25 L50 20 Q52 18 54 20 Q52 22 50 25" fill="#22C55E"/>',
    'broccoli': '<ellipse cx="50" cy="45" rx="18" ry="12" fill="#22C55E"/><circle cx="45" cy="40" r="6" fill="#16A34A"/><circle cx="55" cy="40" r="6" fill="#16A34A"/><circle cx="50" cy="48" r="7" fill="#16A34A"/><rect x="48" y="55" width="4" height="15" fill="#65A30D"/>',
    'carrot': '<path d="M50 65 Q52 45 50 25 Q48 45 50 65" fill="#F97316"/><path d="M48 25 L52 25 L51 20 L49 20 Z" fill="#22C55E"/>',
    'lettuce': '<path d="M50 50 Q35 40 40 55 Q30 50 35 60 Q40 70 50 65 Q60 70 65 60 Q70 50 60 55 Q65 40 50 50" fill="#22C55E" opacity="0.8"/>',
    'pepper': '<ellipse cx="50" cy="45" rx="8" ry="20" fill="#DC2626"/><path d="M48 25 L52 25 Q54 27 52 30 Q48 27 48 25" fill="#22C55E"/>',
    'cucumber': '<ellipse cx="50" cy="45" rx="6" ry="22" fill="#22C55E"/><circle cx="46" cy="35" r="1.5" fill="#16A34A"/><circle cx="54" cy="40" r="1.5" fill="#16A34A"/><circle cx="48" cy="50" r="1.5" fill="#16A34A"/>',
    'beans': '<path d="M45 60 Q40 45 45 30 Q50 35 50 50 Q55 35 60 30 Q65 45 60 60 Q55 55 50 50 Q45 55 45 60" fill="#22C55E"/>',
    'peas': '<circle cx="45" cy="45" r="12" fill="#22C55E" opacity="0.7"/><circle cx="42" cy="42" r="3" fill="#16A34A"/><circle cx="48" cy="40" r="3" fill="#16A34A"/><circle cx="45" cy="48" r="3" fill="#16A34A"/>',
    'radish': '<circle cx="50" cy="50" r="12" fill="#DC2626"/><path d="M48 35 L52 35 L51 25 L49 25 Z" fill="#22C55E"/>',
    'onion': '<ellipse cx="50" cy="50" rx="10" ry="15" fill="#F59E0B"/><path d="M48 30 L52 30 L51 20 L49 20 Z" fill="#22C55E"/>',
    'garlic': '<circle cx="50" cy="50" r="8" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="1"/><path d="M48 35 L52 35 L51 25 L49 25 Z" fill="#22C55E"/>',
    'spinach': '<path d="M50 45 Q35 35 30 50 Q35 65 50 60 Q65 65 70 50 Q65 35 50 45" fill="#22C55E"/>',
    'kale': '<path d="M50 50 Q30 30 35 60 Q45 65 50 55 Q55 65 65 60 Q70 30 50 50" fill="#16A34A"/>',
    'corn': '<rect x="47" y="25" width="6" height="40" fill="#FCD34D"/><path d="M45 25 L55 25 L52 20 L48 20 Z" fill="#22C55E"/>',
    'potato': '<ellipse cx="50" cy="50" rx="15" ry="10" fill="#A3A3A3"/>',
    'beet': '<circle cx="50" cy="50" r="12" fill="#7C2D12"/><path d="M48 30 L52 30 L51 20 L49 20 Z" fill="#22C55E"/>',
    
    // Herbs
    'basil': '<path d="M50 50 Q40 40 35 50 Q40 60 50 55 Q60 60 65 50 Q60 40 50 50" fill="#22C55E"/><circle cx="45" cy="45" r="2" fill="#16A34A"/><circle cx="55" cy="45" r="2" fill="#16A34A"/>',
    'parsley': '<path d="M45 45 Q35 35 40 50 Q30 45 35 55 Q40 60 45 55 M55 45 Q65 35 60 50 Q70 45 65 55 Q60 60 55 55" fill="#22C55E"/>',
    'cilantro': '<path d="M50 50 Q40 35 35 50 Q45 60 50 55 Q55 60 65 50 Q60 35 50 50" fill="#22C55E"/>',
    'thyme': '<rect x="48" y="35" width="4" height="25" fill="#16A34A"/><circle cx="46" cy="40" r="1" fill="#22C55E"/><circle cx="54" cy="42" r="1" fill="#22C55E"/><circle cx="46" cy="45" r="1" fill="#22C55E"/>',
    'oregano': '<ellipse cx="50" cy="45" rx="12" ry="8" fill="#22C55E"/><circle cx="45" cy="42" r="2" fill="#16A34A"/><circle cx="55" cy="42" r="2" fill="#16A34A"/>',
    'sage': '<ellipse cx="50" cy="45" rx="15" ry="10" fill="#9CA3AF"/><path d="M40 40 Q50 35 60 40" stroke="#6B7280" stroke-width="1" fill="none"/>',
    'rosemary': '<rect x="48" y="30" width="4" height="30" fill="#16A34A"/><rect x="46" y="35" width="1" height="8" fill="#22C55E"/><rect x="53" y="38" width="1" height="8" fill="#22C55E"/>',
    'mint': '<path d="M50 50 Q35 40 40 55 Q50 60 50 50 Q50 60 60 55 Q65 40 50 50" fill="#22C55E"/><path d="M45 45 Q50 40 55 45" stroke="#16A34A" stroke-width="1" fill="none"/>',
    'chives': '<rect x="47" y="25" width="2" height="35" fill="#22C55E"/><rect x="50" y="25" width="2" height="35" fill="#22C55E"/><rect x="53" y="25" width="2" height="35" fill="#22C55E"/>',
    'dill': '<rect x="49" y="35" width="2" height="20" fill="#22C55E"/><circle cx="46" cy="38" r="1" fill="#FCD34D"/><circle cx="54" cy="40" r="1" fill="#FCD34D"/><circle cx="48" cy="45" r="1" fill="#FCD34D"/>',
    
    // Flowers
    'marigold': '<circle cx="50" cy="45" r="12" fill="#F97316"/><circle cx="50" cy="45" r="8" fill="#FCD34D"/><rect x="49" y="55" width="2" height="10" fill="#22C55E"/>',
    'nasturtium': '<circle cx="50" cy="45" r="10" fill="#DC2626"/><circle cx="50" cy="45" r="6" fill="#FCD34D"/><rect x="49" y="53" width="2" height="8" fill="#22C55E"/>',
    'sunflower': '<circle cx="50" cy="40" r="15" fill="#FCD34D" stroke="#F97316" stroke-width="2"/><circle cx="50" cy="40" r="5" fill="#92400E"/><rect x="49" y="53" width="2" height="12" fill="#22C55E"/>',
    'lavender': '<ellipse cx="50" cy="35" rx="4" ry="15" fill="#8B5CF6"/><rect x="49" y="48" width="2" height="15" fill="#22C55E"/>',
    
    // Default icon for unknown plants
    'default': '<circle cx="50" cy="45" r="12" fill="#22C55E" stroke="#16A34A" stroke-width="2"/><path d="M45 40 L55 40 M50 35 L50 50" stroke="#16A34A" stroke-width="2"/>'
};

// Function to get plant icon
function getPlantIcon(plantName) {
    const name = plantName.toLowerCase().trim();
    return plantIcons[name] || plantIcons['default'];
}

// Function to generate SVG
function generateGardenSVG(data) {
    const { bed_size, plants } = data;
    
    // Parse bed dimensions
    const [width, height] = bed_size.split('x').map(Number);
    const cellSize = 80; // Size of each grid cell
    const svgWidth = width * cellSize + 40; // Add padding
    const svgHeight = height * cellSize + 40;
    
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add background
    svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="#8B4513" opacity="0.3"/>`;
    
    // Add grid lines
    for (let i = 0; i <= width; i++) {
        const x = i * cellSize + 20;
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="${svgHeight - 20}" stroke="#D4A574" stroke-width="1" opacity="0.5"/>`;
    }
    for (let i = 0; i <= height; i++) {
        const y = i * cellSize + 20;
        svg += `<line x1="20" y1="${y}" x2="${svgWidth - 20}" y2="${y}" stroke="#D4A574" stroke-width="1" opacity="0.5"/>`;
    }
    
    // Add plants
    plants.forEach((plant, index) => {
        let x, y;
        
        // Simple positioning logic - you can enhance this based on your AI's position format
        if (plant.position) {
            // If position is specified (like "A1", "B2", etc.)
            if (typeof plant.position === 'string') {
                const col = plant.position.charCodeAt(0) - 65; // A=0, B=1, etc.
                const row = parseInt(plant.position.slice(1)) - 1;
                x = col * cellSize + 20 + cellSize/2;
                y = row * cellSize + 20 + cellSize/2;
            } else if (plant.position.x !== undefined && plant.position.y !== undefined) {
                // If position is {x: 1, y: 2}
                x = plant.position.x * cellSize + 20 + cellSize/2;
                y = plant.position.y * cellSize + 20 + cellSize/2;
            }
        } else {
            // Auto-position if no position specified
            const cols = Math.ceil(Math.sqrt(plants.length));
            const col = index % cols;
            const row = Math.floor(index / cols);
            x = col * cellSize + 20 + cellSize/2;
            y = row * cellSize + 20 + cellSize/2;
        }
        
        // Add plant icon
        const icon = getPlantIcon(plant.name);
        svg += `<g transform="translate(${x-50}, ${y-50})">`;
        svg += icon;
        svg += `</g>`;
        
        // Add plant name
        svg += `<text x="${x}" y="${y + 40}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#2D3748" font-weight="bold">${plant.name}</text>`;
        
        // Add spacing indicator if provided
        if (plant.spacing) {
            svg += `<circle cx="${x}" cy="${y}" r="${cellSize/3}" fill="none" stroke="#4A5568" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>`;
        }
    });
    
    // Add title
    svg += `<text x="${svgWidth/2}" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#2D3748">Garden Layout (${bed_size})</text>`;
    
    svg += '</svg>';
    
    return svg;
}

// API endpoint
app.post('/generate-garden', (req, res) => {
    try {
        console.log('Received data:', JSON.stringify(req.body, null, 2));
        
        // Validate input
        if (!req.body.bed_size || !req.body.plants) {
            return res.status(400).json({ 
                error: 'Missing required fields: bed_size and plants',
                example: {
                    bed_size: "4x8",
                    plants: [
                        { name: "Tomato", position: "A1", type: "main" },
                        { name: "Basil", position: "B2", type: "companion" }
                    ]
                }
            });
        }
        
        // Generate SVG
        const svg = generateGardenSVG(req.body);
        
        // Return SVG
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
        
    } catch (error) {
        console.error('Error generating garden layout:', error);
        res.status(500).json({ error: 'Failed to generate garden layout' });
    }
});

// Test endpoint
app.get('/test', (req, res) => {
    const testData = {
        bed_size: "4x4",
        plants: [
            { name: "Tomato", position: "A1", type: "main" },
            { name: "Basil", position: "B1", type: "companion" },
            { name: "Marigold", position: "A2", type: "companion" },
            { name: "Lettuce", position: "B2", type: "companion" }
        ]
    };
    
    const svg = generateGardenSVG(testData);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'Garden Layout SVG Generator API is running!',
        endpoints: {
            'POST /generate-garden': 'Generate garden layout SVG',
            'GET /test': 'Test with sample data',
            'GET /': 'This health check'
        }
    });
});

app.listen(port, () => {
    console.log(`Garden Layout API running on port ${port}`);
    console.log(`Test it at: http://localhost:${port}/test`);
});
