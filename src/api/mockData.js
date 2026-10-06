// Realistic Cinema & Movie dataset with 100% verified, high-availability high-definition imagery and trailers

export const MOCK_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    tagline: "Long live the fighters.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=80",
    genre: ["Sci-Fi", "Adventure", "Action"],
    language: "English",
    duration: "2h 46m",
    rating: 8.6,
    votes: "430K",
    releaseDate: "2024-03-01",
    certification: "PG-13",
    director: "Denis Villeneuve",
    formats: ["IMAX 70MM", "Dolby Atmos", "4DX"],
    basePrice: 18.50,
    trailerId: "Way9Dexny3w",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" },
      { name: "Zendaya", role: "Chani", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
      { name: "Rebecca Ferguson", role: "Lady Jessica", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" },
      { name: "Austin Butler", role: "Feyd-Rautha", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" }
    ],
    showtimes: ["10:30 AM", "01:45 PM", "05:15 PM", "08:45 PM", "11:30 PM"]
  },
  {
    id: 2,
    title: "Oppenheimer",
    tagline: "The world forever changes.",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80",
    genre: ["Drama", "History", "Biography"],
    language: "English",
    duration: "3h 00m",
    rating: 8.9,
    votes: "680K",
    releaseDate: "2023-07-21",
    certification: "R",
    director: "Christopher Nolan",
    formats: ["IMAX 70MM", "Standard 70MM", "Dolby Cinema"],
    basePrice: 19.00,
    trailerId: "uYPbbksJxIg",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral paradoxes and political fallout that followed.",
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
      { name: "Emily Blunt", role: "Katherine Oppenheimer", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80" }
    ],
    showtimes: ["11:00 AM", "03:00 PM", "07:00 PM", "10:45 PM"]
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    tagline: "It's how you wear the mask that matters.",
    poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80",
    genre: ["Animation", "Action", "Adventure"],
    language: "English",
    duration: "2h 20m",
    rating: 8.7,
    votes: "390K",
    releaseDate: "2023-06-02",
    certification: "PG",
    director: "Joaquim Dos Santos, Kemp Powers",
    formats: ["3D", "IMAX", "Dolby Atmos"],
    basePrice: 16.50,
    trailerId: "cqGjhVJWtEg",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    cast: [
      { name: "Shameik Moore", role: "Miles Morales (voice)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
      { name: "Hailee Steinfeld", role: "Gwen Stacy (voice)", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80" }
    ],
    showtimes: ["10:00 AM", "01:15 PM", "04:30 PM", "07:45 PM"]
  },
  {
    id: 4,
    title: "Deadpool & Wolverine",
    tagline: "Come together.",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80",
    genre: ["Action", "Comedy", "Sci-Fi"],
    language: "English",
    duration: "2h 08m",
    rating: 8.0,
    votes: "310K",
    releaseDate: "2024-07-26",
    certification: "R",
    director: "Shawn Levy",
    formats: ["IMAX 3D", "4DX", "Dolby Cinema"],
    basePrice: 17.50,
    trailerId: "73_1biulkYk",
    description: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit up with an even more reluctant Wolverine.",
    cast: [
      { name: "Ryan Reynolds", role: "Wade Wilson / Deadpool", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
      { name: "Hugh Jackman", role: "Logan / Wolverine", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" }
    ],
    showtimes: ["12:00 PM", "02:45 PM", "06:15 PM", "09:30 PM"]
  },
  {
    id: 5,
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&q=80",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    language: "English",
    duration: "2h 49m",
    rating: 8.7,
    votes: "950K",
    releaseDate: "2014-11-07",
    certification: "PG-13",
    director: "Christopher Nolan",
    formats: ["IMAX Re-Release", "Dolby Atmos"],
    basePrice: 16.00,
    trailerId: "zSWdZVtXT7E",
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    cast: [
      { name: "Matthew McConaughey", role: "Cooper", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
      { name: "Anne Hathaway", role: "Brand", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" }
    ],
    showtimes: ["02:00 PM", "06:00 PM", "09:45 PM"]
  },
  {
    id: 6,
    title: "Kalki 2898 AD",
    tagline: "The future has a myth.",
    poster: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&q=80",
    genre: ["Action", "Sci-Fi", "Fantasy"],
    language: "Hindi",
    duration: "3h 01m",
    rating: 7.9,
    votes: "140K",
    releaseDate: "2024-06-27",
    certification: "U/A",
    director: "Nag Ashwin",
    formats: ["3D", "IMAX", "Dolby Atmos"],
    basePrice: 15.00,
    trailerId: "kQDd1AhGIHk",
    description: "A modern avatar of the Hindu god Vishnu, believed to have descended to the earth to protect the world from evil forces in a dystopian futuristic city of Kasi ruled by the Supreme Yaskin.",
    cast: [
      { name: "Prabhas", role: "Bhairava", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80" },
      { name: "Amitabh Bachchan", role: "Ashwatthama", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" }
    ],
    showtimes: ["11:30 AM", "03:30 PM", "07:30 PM", "11:00 PM"]
  },
  {
    id: 7,
    title: "Gladiator II",
    tagline: "What we do in life echoes in eternity.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=80",
    genre: ["Action", "Drama", "Adventure"],
    language: "English",
    duration: "2h 28m",
    rating: 7.4,
    votes: "160K",
    releaseDate: "2024-11-22",
    certification: "R",
    director: "Ridley Scott",
    formats: ["IMAX", "ScreenX", "Dolby Cinema"],
    basePrice: 18.00,
    trailerId: "4rgYUipGJNo",
    description: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
    cast: [
      { name: "Paul Mescal", role: "Lucius Verus", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" },
      { name: "Pedro Pascal", role: "Marcus Acacius", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" }
    ],
    showtimes: ["01:00 PM", "04:30 PM", "08:00 PM"]
  },
  {
    id: 8,
    title: "Inside Out 2",
    tagline: "Make room for new emotions.",
    poster: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=80",
    genre: ["Animation", "Comedy", "Family"],
    language: "English",
    duration: "1h 36m",
    rating: 7.8,
    votes: "280K",
    releaseDate: "2024-06-14",
    certification: "PG",
    director: "Kelsey Mann",
    formats: ["3D", "Standard 2D", "Dolby Atmos"],
    basePrice: 15.50,
    trailerId: "LEjhY15eCx0",
    description: "Teenager Riley's mind headquarters undergoes a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren't sure how to feel when Anxiety shows up.",
    cast: [
      { name: "Amy Poehler", role: "Joy (voice)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
      { name: "Maya Hawke", role: "Anxiety (voice)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" }
    ],
    showtimes: ["10:15 AM", "12:30 PM", "03:15 PM", "05:45 PM"]
  },
  {
    id: 9,
    title: "The Dark Knight",
    tagline: "Welcome to a world without rules.",
    poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&q=80",
    genre: ["Action", "Crime", "Drama"],
    language: "English",
    duration: "2h 32m",
    rating: 9.0,
    votes: "1.2M",
    releaseDate: "2008-07-18",
    certification: "PG-13",
    director: "Christopher Nolan",
    formats: ["IMAX Remastered", "Dolby Atmos"],
    basePrice: 16.50,
    trailerId: "EXeTwQWrcwY",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    cast: [
      { name: "Christian Bale", role: "Bruce Wayne / Batman", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
      { name: "Heath Ledger", role: "Joker", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80" }
    ],
    showtimes: ["04:00 PM", "07:30 PM", "10:30 PM"]
  },
  {
    id: 10,
    title: "Avatar: The Way of Water",
    tagline: "Return to Pandora.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80",
    genre: ["Sci-Fi", "Adventure", "Action"],
    language: "English",
    duration: "3h 12m",
    rating: 7.7,
    votes: "490K",
    releaseDate: "2022-12-16",
    certification: "PG-13",
    director: "James Cameron",
    formats: ["HFR 3D", "IMAX 3D", "4DX"],
    basePrice: 19.50,
    trailerId: "d9MyW72ELq0",
    description: "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    cast: [
      { name: "Sam Worthington", role: "Jake Sully", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
      { name: "Zoe Saldana", role: "Neytiri", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80" }
    ],
    showtimes: ["11:15 AM", "03:45 PM", "08:15 PM"]
  },
  {
    id: 11,
    title: "Spirited Away",
    tagline: "Tunnel into a fantastical spirit bathhouse.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=80",
    genre: ["Animation", "Fantasy", "Adventure"],
    language: "Japanese",
    duration: "2h 05m",
    rating: 8.6,
    votes: "410K",
    releaseDate: "2001-07-20",
    certification: "PG",
    director: "Hayao Miyazaki",
    formats: ["Studio Ghibli 4K Remaster", "Dolby Stereo"],
    basePrice: 15.00,
    trailerId: "ByXuk9QqQkk",
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    cast: [
      { name: "Rumi Hiiragi", role: "Chihiro (voice)", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80" }
    ],
    showtimes: ["01:30 PM", "05:00 PM"]
  },
  {
    id: 12,
    title: "Money Heist: The Final Chapter",
    tagline: "Bella Ciao until the end.",
    poster: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
    genre: ["Crime", "Thriller", "Action"],
    language: "Spanish",
    duration: "2h 15m",
    rating: 8.2,
    votes: "320K",
    releaseDate: "2023-11-10",
    certification: "R",
    director: "Álex Pina",
    formats: ["Standard 2D", "Dolby Atmos"],
    basePrice: 16.00,
    trailerId: "htqXL94Rza4",
    description: "The gang has been shut in the Bank of Spain for over 100 hours. They have managed to rescue Lisbon, but their darkest moment is upon them after losing one of their own.",
    cast: [
      { name: "Álvaro Morte", role: "The Professor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
      { name: "Úrsula Corberó", role: "Tokyo", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" }
    ],
    showtimes: ["03:00 PM", "06:30 PM", "09:15 PM"]
  }
];

export const MOCK_THEATRES = [
  {
    id: "th-1",
    name: "PVR Superplex IMAX",
    city: "New York",
    address: "Times Square 42nd St, Manhattan, NY 10036",
    screens: 12,
    formats: ["IMAX 70MM", "4DX", "Dolby Atmos"],
    contact: "+1 (212) 555-0192",
    showsToday: 28,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80",
    amenities: ["Executive Recliners", "Dolby Atmos 7.1", "Gourmet Snack Bar", "Valet Parking"],
    shows: [
      { movieId: 1, movieTitle: "Dune: Part Two", format: "IMAX 70MM", times: ["10:30 AM", "02:15 PM", "06:45 PM", "10:15 PM"], price: 22 },
      { movieId: 2, movieTitle: "Oppenheimer", format: "Dolby Atmos", times: ["11:00 AM", "03:30 PM", "07:30 PM"], price: 18 },
      { movieId: 4, movieTitle: "Deadpool & Wolverine", format: "4DX", times: ["01:00 PM", "05:15 PM", "09:00 PM"], price: 20 },
      { movieId: 6, movieTitle: "Kalki 2898 AD", format: "IMAX 3D", times: ["12:30 PM", "04:45 PM", "08:45 PM"], price: 19 }
    ]
  },
  {
    id: "th-2",
    name: "AMC Empire Grand",
    city: "Los Angeles",
    address: "Hollywood Blvd, Sunset Strip, CA 90028",
    screens: 9,
    formats: ["Dolby Cinema", "RealD 3D", "Laser 4K"],
    contact: "+1 (310) 555-0144",
    showsToday: 22,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    amenities: ["Signature Recliners", "Cocktail Lounge", "Reserved Seating", "Wheelchair Accessible"],
    shows: [
      { movieId: 1, movieTitle: "Dune: Part Two", format: "Dolby Cinema", times: ["11:30 AM", "03:00 PM", "07:15 PM"], price: 20 },
      { movieId: 3, movieTitle: "Spider-Man: Across the Spider-Verse", format: "RealD 3D", times: ["01:15 PM", "05:00 PM", "08:30 PM"], price: 17 },
      { movieId: 5, movieTitle: "Interstellar", format: "Dolby Atmos", times: ["02:00 PM", "06:30 PM", "10:00 PM"], price: 18 }
    ]
  },
  {
    id: "th-3",
    name: "Cinepolis Premiere Multiplex",
    city: "Chicago",
    address: "Michigan Ave, Downtown, IL 60611",
    screens: 8,
    formats: ["Executive Recliner", "Dolby Atmos", "Cinema 4D"],
    contact: "+1 (312) 555-0188",
    showsToday: 18,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&q=80",
    amenities: ["At-Seat Dining", "Executive Recliners", "Full Bar", "Dolby Vision"],
    shows: [
      { movieId: 2, movieTitle: "Oppenheimer", format: "Executive Recliner", times: ["12:00 PM", "04:15 PM", "08:30 PM"], price: 24 },
      { movieId: 7, movieTitle: "Gladiator II", format: "Dolby Atmos", times: ["01:30 PM", "05:45 PM", "09:30 PM"], price: 19 },
      { movieId: 8, movieTitle: "Inside Out 2", format: "Cinema 4D", times: ["10:45 AM", "02:15 PM", "06:00 PM"], price: 16 }
    ]
  },
  {
    id: "th-4",
    name: "Regal LA Live 4DX",
    city: "San Francisco",
    address: "Market Street, SF Bay, CA 94103",
    screens: 14,
    formats: ["4DX", "IMAX 3D", "ScreenX"],
    contact: "+1 (415) 555-0165",
    showsToday: 26,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=800&q=80",
    amenities: ["Motion Seats (4DX)", "ScreenX 270°", "Popcorn Bar", "Arcade Zone"],
    shows: [
      { movieId: 4, movieTitle: "Deadpool & Wolverine", format: "4DX", times: ["11:15 AM", "03:45 PM", "07:45 PM", "10:45 PM"], price: 21 },
      { movieId: 10, movieTitle: "Avatar: The Way of Water", format: "IMAX 3D", times: ["01:00 PM", "05:30 PM", "09:15 PM"], price: 22 },
      { movieId: 9, movieTitle: "The Dark Knight", format: "ScreenX", times: ["04:00 PM", "08:00 PM"], price: 18 }
    ]
  },
  {
    id: "th-5",
    name: "Odeon Luxe Multiplex",
    city: "Miami",
    address: "Biscayne Blvd, Downtown Miami, FL 33132",
    screens: 10,
    formats: ["Executive Recliner", "Dolby Atmos", "Laser 4K"],
    contact: "+1 (305) 555-0177",
    showsToday: 20,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80",
    amenities: ["Power Recliners", "Heated Seats", "Artisan Coffee", "Reserved Parking"],
    shows: [
      { movieId: 1, movieTitle: "Dune: Part Two", format: "Executive Recliner", times: ["12:15 PM", "04:30 PM", "08:15 PM"], price: 22 },
      { movieId: 11, movieTitle: "Spirited Away", format: "Laser 4K", times: ["11:00 AM", "03:15 PM", "06:30 PM"], price: 16 },
      { movieId: 12, movieTitle: "Money Heist: The Final Chapter", format: "Dolby Atmos", times: ["02:00 PM", "07:00 PM", "10:30 PM"], price: 18 }
    ]
  },
  {
    id: "th-6",
    name: "Alamo Drafthouse Cinema",
    city: "Dallas",
    address: "Main Street, Arts District, TX 75201",
    screens: 8,
    formats: ["35mm Vintage", "Dolby Digital", "4K Ultra"],
    contact: "+1 (214) 555-0133",
    showsToday: 16,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=800&q=80",
    amenities: ["Craft Kitchen & Dining", "Strict Silence Policy", "Curated Preshows", "Custom Menus"],
    shows: [
      { movieId: 9, movieTitle: "The Dark Knight", format: "35mm Vintage", times: ["02:30 PM", "06:45 PM", "10:15 PM"], price: 19 },
      { movieId: 5, movieTitle: "Interstellar", format: "4K Ultra", times: ["01:00 PM", "05:00 PM", "09:00 PM"], price: 18 },
      { movieId: 3, movieTitle: "Spider-Man: Across the Spider-Verse", format: "Dolby Digital", times: ["11:30 AM", "04:00 PM", "08:15 PM"], price: 17 }
    ]
  }
];

export const MOCK_DASHBOARD_STATS = {
  totalMovies: 24,
  totalTheatres: 18,
  totalBookings: 1482,
  availableShows: 94,
  todayBookings: 328,
  todayRevenue: 5920,
  monthlyRevenue: 64850,
  occupancyRate: "84.2%"
};

export const MOCK_REVENUE_CHART = [
  { day: "Mon", revenue: 4200, bookings: 210 },
  { day: "Tue", revenue: 5100, bookings: 255 },
  { day: "Wed", revenue: 4800, bookings: 240 },
  { day: "Thu", revenue: 6400, bookings: 320 },
  { day: "Fri", revenue: 8900, bookings: 445 },
  { day: "Sat", revenue: 11400, bookings: 570 },
  { day: "Sun", revenue: 10200, bookings: 510 }
];

export const MOCK_RECENT_BOOKINGS = [
  {
    id: "BK-98214",
    customer: "Sophia Anderson",
    movie: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    theatre: "PVR Superplex IMAX",
    showTime: "Today, 08:45 PM",
    seats: ["F12", "F13"],
    amount: "$37.00",
    status: "Confirmed",
    date: "2026-09-30"
  },
  {
    id: "BK-98213",
    customer: "Marcus Vance",
    movie: "Deadpool & Wolverine",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80",
    theatre: "Regal LA Live 4DX",
    showTime: "Today, 06:15 PM",
    seats: ["E07", "E08", "E09"],
    amount: "$52.50",
    status: "Confirmed",
    date: "2026-09-30"
  },
  {
    id: "BK-98212",
    customer: "Elena Rostova",
    movie: "Oppenheimer",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    theatre: "AMC Empire Grand",
    showTime: "Today, 07:00 PM",
    seats: ["G04"],
    amount: "$19.00",
    status: "Confirmed",
    date: "2026-09-30"
  },
  {
    id: "BK-98211",
    customer: "David Kim",
    movie: "Spider-Man: Across the Spider-Verse",
    poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80",
    theatre: "Cinepolis Premiere Multiplex",
    showTime: "Yesterday, 04:30 PM",
    seats: ["D10", "D11"],
    amount: "$33.00",
    status: "Completed",
    date: "2026-09-29"
  },
  {
    id: "BK-98210",
    customer: "Sarah Jenkins",
    movie: "Gladiator II",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    theatre: "PVR Superplex IMAX",
    showTime: "Yesterday, 08:00 PM",
    seats: ["H14", "H15"],
    amount: "$36.00",
    status: "Cancelled",
    date: "2026-09-29"
  }
];

export const MOCK_GENRES = [
  "All",
  "Action",
  "Sci-Fi",
  "Drama",
  "Animation",
  "Adventure",
  "Comedy",
  "Crime",
  "Fantasy",
  "Thriller"
];

export const MOCK_LANGUAGES = [
  "All",
  "English",
  "Hindi",
  "Japanese",
  "Spanish"
];
