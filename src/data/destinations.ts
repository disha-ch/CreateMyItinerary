import { Destination } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    description: 'A neon-lit metropolis where hyper-modern technology seamlessly blends with ancient temples, cherry blossom avenues, and world-class culinary experiences.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    bestTime: 'March to May (Cherry Blossoms) or October to November (Autumn Leaves)',
    budgetLevel: 'High',
    rating: 4.9,
    tags: ['Tech', 'Culture', 'Foodie', 'Urban'],
    mustSee: ['Shibuya Crossing', 'Senso-ji Temple', 'TeamLab Planets', 'Meiji Shrine', 'Shinjuku Gyoen'],
    suggestedItinerary: [
      { day: 1, title: 'Historic Asakusa & Modern Akihabara', details: 'Explore Senso-ji temple in the morning, taste traditional street snacks, then dive into the electric gaming and tech capital of Akihabara.' },
      { day: 2, title: 'Shibuya, Harajuku & Meiji Shrine', details: 'Walk through the peaceful forest of Meiji Shrine, shop eccentric fashion on Takeshita Street, and cross the iconic Shibuya Scramble at sunset.' },
      { day: 3, title: 'Digital Art & TeamLab Planets', details: 'Immerse yourself in giant interactive projections at TeamLab Planets in Toyosu, followed by delicious sushi at the nearby outer markets.' }
    ]
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    description: 'A spectacular 50-kilometer stretch of coastline in Campania, Italy, featuring vertical cliffs, colorful pastel fishing villages, lemon orchards, and azure waters.',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    bestTime: 'May to September (Warm summer sun & beach life)',
    budgetLevel: 'High',
    rating: 4.8,
    tags: ['Scenic', 'Coastal', 'Romance', 'Relaxation'],
    mustSee: ['Positano Cliff Village', 'Ravello Gardens', 'Fiordo di Furore', 'Amalfi Cathedral', 'Path of the Gods'],
    suggestedItinerary: [
      { day: 1, title: 'Positano Pastel Streets', details: 'Arrive and wander down Positano’s cascading cobblestone staircases, browse linen boutiques, and dine on fresh lemon pasta on the beachfront.' },
      { day: 2, title: 'Path of the Gods Hike', details: 'Trek the high cliff trail from Bomerano to Nocelle for awe-inspiring panoramic vistas of the entire peninsula.' },
      { day: 3, title: 'Ravello Mountain Village', details: 'Take a scenic bus up to Ravello, visit Villa Cimbrone’s "Terrace of Infinity", and listen to classical open-air music with a sea view.' }
    ]
  },
  {
    id: 'banff',
    name: 'Banff National Park',
    country: 'Canada',
    description: 'Canada’s oldest national park, nestled in the heart of the majestic Rocky Mountains, boasting turquoise glacial lakes, soaring snow peaks, and abundant wildlife.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    bestTime: 'June to August (Hiking & Lakes) or December to March (Skiing & Hot Springs)',
    budgetLevel: 'Medium',
    rating: 4.9,
    tags: ['Adventure', 'Nature', 'Wildlife', 'Active'],
    mustSee: ['Lake Louise', 'Moraine Lake', 'Banff Gondola', 'Johnston Canyon', 'Bow Valley Parkway'],
    suggestedItinerary: [
      { day: 1, title: 'The Lake Louise Experience', details: 'Arrive early to witness sunrise at Moraine Lake, then canoe across the deep turquoise waters of Lake Louise and hike up to the historic Plain of Six Glaciers Tea House.' },
      { day: 2, title: 'Canyon Waterfalls & Mountain Gondola', details: 'Walk along the suspended catwalks of Johnston Canyon to see frozen or roaring waterfalls, then take the Banff Gondola to Sulphur Mountain summit for a 360-degree panorama.' },
      { day: 3, title: 'Bow Valley Parkway Drive & Hot Springs', details: 'Drive the scenic route keeping an eye out for elk, grizzly bears, and wolves, ending your journey with a long soak in the Banff Upper Hot Springs.' }
    ]
  },
  {
    id: 'cairo',
    name: 'Giza & Cairo',
    country: 'Egypt',
    description: 'The historic gateway to ancient civilization, housing the last remaining wonder of the ancient world alongside vibrant chaotic bazaars, Coptic history, and the Nile river.',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
    bestTime: 'October to April (Cool, comfortable winter weather)',
    budgetLevel: 'Low',
    rating: 4.7,
    tags: ['History', 'Archaeology', 'Bazaar', 'Budget'],
    mustSee: ['Great Pyramids of Giza', 'The Sphinx', 'Grand Egyptian Museum', 'Khan el-Khalili Bazaar', 'Al-Azhar Mosque'],
    suggestedItinerary: [
      { day: 1, title: 'The Pyramids & Sphinx', details: 'Ride a camel across the desert plateau of Giza, explore the interior chambers of the Great Pyramid, and stand face-to-face with the mystical Sphinx.' },
      { day: 2, title: 'Grand Egyptian Museum & Nile Cruise', details: 'Browse thousands of years of royal pharaonic treasures, then board a traditional wooden Felucca sailboat for a relaxing sunset cruise along the Nile.' },
      { day: 3, title: 'Historic Cairo & Khan el-Khalili', details: 'Lose yourself in the labyrinth of Khan el-Khalili bazaar, smelling spices, shopping for handmade lanterns, and sipping mint tea in El Fishawy cafe.' }
    ]
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    description: 'The cultural capital of Japan, famous for its thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden merchant houses.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    bestTime: 'April to May (Spring) or October to November (Autumn leaves)',
    budgetLevel: 'Medium',
    rating: 4.8,
    tags: ['Zen', 'Culture', 'Temples', 'History'],
    mustSee: ['Fushimi Inari-taisha', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Gion District', 'Kiyomizu-dera'],
    suggestedItinerary: [
      { day: 1, title: 'Fushimi Inari Torii Gates & Kiyomizu-dera', details: 'Hike through thousands of bright red Shinto torii gates at dawn, then explore the historic wooden stage of Kiyomizu-dera overlooking the city.' },
      { day: 2, title: 'Golden Pavilion & Zen Gardens', details: 'Visit the shimmering Golden Pavilion (Kinkaku-ji) reflecting on a mirror pond, followed by silent meditation at Ryoan-ji rock garden.' },
      { day: 3, title: 'Bamboo Grove & Geisha Districts', details: 'Stroll through Arashiyama’s towering green bamboo forest, and cap off your trip searching for geishas in the lantern-lit alleys of Gion.' }
    ]
  }
];
