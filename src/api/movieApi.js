import axios from 'axios';
import { MOCK_MOVIES, MOCK_DASHBOARD_STATS, MOCK_THEATRES, MOCK_RECENT_BOOKINGS } from './mockData';

// Cinema API Client using Axios
export const cinemaApiClient = axios.create({
  baseURL: '/api/cinema',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Primary Movie & Cinema Data Service
export const movieService = {
  /**
   * Fetch movies with search, filters, sorting, and pagination
   */
  async getMovies({
    search = '',
    genre = 'All',
    language = 'All',
    minRating = 0,
    sortBy = 'releaseDate_desc',
    page = 1,
    limit = 6
  } = {}) {
    // Simulated asynchronous REST API call with realistic latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter pipeline
    let results = [...MOCK_MOVIES];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q)) ||
          (m.director && m.director.toLowerCase().includes(q))
      );
    }

    // Genre filter
    if (genre && genre !== 'All') {
      results = results.filter((m) =>
        m.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    // Language filter
    if (language && language !== 'All') {
      results = results.filter((m) =>
        m.language.toLowerCase() === language.toLowerCase()
      );
    }

    // Rating filter
    if (minRating > 0) {
      results = results.filter((m) => m.rating >= minRating);
    }

    // Sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'releaseDate_desc':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'releaseDate_asc':
          return new Date(a.releaseDate) - new Date(b.releaseDate);
        case 'rating_desc':
          return b.rating - a.rating;
        case 'rating_asc':
          return a.rating - b.rating;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    // Pagination calculations
    const totalCount = results.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const validPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validPage - 1) * limit;
    const paginatedMovies = results.slice(startIndex, startIndex + limit);

    return {
      movies: paginatedMovies,
      totalCount,
      totalPages,
      currentPage: validPage,
      source: 'Multiplex Cinema Catalog'
    };
  },

  /**
   * Fetch single movie detail by ID
   */
  async getMovieById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const movie = MOCK_MOVIES.find((m) => String(m.id) === String(id));
    if (!movie) {
      throw new Error(`Movie with ID #${id} was not found in the catalogue.`);
    }
    return movie;
  },

  /**
   * Fetch Dashboard metrics and stats (includes real user bookings from storage)
   */
  async getDashboardData() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allBookings = this.getUserBookings().map((b) => ({
      id: b.bookingId || b.id,
      customer: b.customerName || b.customer || 'Moviegoer',
      movie: b.movieTitle || b.movie,
      poster: b.poster,
      theatre: b.theatreName || b.theatre,
      showTime: b.showTime || `${b.date || 'Today'}, ${b.showtime}`,
      seats: b.selectedSeats || b.seats || [],
      amount: b.amount || `$${Number(b.grandTotal || 0).toFixed(2)}`,
      status: b.status || 'Confirmed',
      date: b.date || 'Today',
      paymentMethod: b.paymentMethod || 'Credit Card'
    }));

    const addedRevenue = allBookings.reduce((sum, b) => {
      const val = parseFloat(String(b.amount || '0').replace(/[^0-9.]/g, '')) || 0;
      return sum + val;
    }, 0);

    return {
      stats: {
        ...MOCK_DASHBOARD_STATS,
        totalBookings: MOCK_DASHBOARD_STATS.totalBookings + (allBookings.length - MOCK_RECENT_BOOKINGS.length),
        todayBookings: MOCK_DASHBOARD_STATS.todayBookings + (allBookings.length - MOCK_RECENT_BOOKINGS.length),
        todayRevenue: Math.round(MOCK_DASHBOARD_STATS.todayRevenue + addedRevenue)
      },
      theatres: MOCK_THEATRES,
      recentBookings: allBookings,
      featuredMovies: MOCK_MOVIES.slice(0, 4)
    };
  },

  /**
   * Module 4: Fetch Theatres with search, city filter, and pagination
   */
  async getTheatres({ city = 'All', search = '', page = 1, limit = 4 } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 250));

    let results = [...MOCK_THEATRES];

    if (city && city !== 'All') {
      results = results.filter((th) => th.city.toLowerCase() === city.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (th) =>
          th.name.toLowerCase().includes(q) ||
          th.address.toLowerCase().includes(q) ||
          th.city.toLowerCase().includes(q) ||
          th.formats.some((f) => f.toLowerCase().includes(q))
      );
    }

    const totalCount = results.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const validPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validPage - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return {
      theatres: paginated,
      totalCount,
      totalPages,
      currentPage: validPage
    };
  },

  /**
   * Module 4: Fetch single theatre by ID
   */
  async getTheatreById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const th = MOCK_THEATRES.find((t) => String(t.id) === String(id));
    if (!th) {
      throw new Error(`Theatre with ID #${id} was not found.`);
    }
    return th;
  },

  /**
   * Module 5: Fetch Booked Seats for a specific show & date to prevent duplicate bookings
   */
  async getBookedSeats({ theatreId = 'th-1', movieId = 1, showtime = '06:45 PM', date = 'Today' } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const cleanTime = String(showtime).replace(/[^a-zA-Z0-9]/g, '_');
    const cleanDate = String(date).replace(/[^a-zA-Z0-9]/g, '_');
    const storageKey = `cinepass_booked_${theatreId}_${movieId}_${cleanTime}_${cleanDate}`;
    const stored = localStorage.getItem(storageKey);

    const defaultBooked = ['B4', 'B5', 'C7', 'C8', 'D4', 'D5', 'D6', 'F8', 'F9'];
    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify(defaultBooked));
      return defaultBooked;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return defaultBooked;
    }
  },

  /**
   * Module 6: Create Booking and permanently mark seats as booked (Prevent Duplicate Booking)
   */
  async createBooking(bookingData) {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const { theatreId, movieId, showtime, date, selectedSeats } = bookingData;
    const cleanTime = String(showtime).replace(/[^a-zA-Z0-9]/g, '_');
    const cleanDate = String(date).replace(/[^a-zA-Z0-9]/g, '_');
    const storageKey = `cinepass_booked_${theatreId}_${movieId}_${cleanTime}_${cleanDate}`;
    
    // Check for duplicate booking clash
    const currentBooked = await this.getBookedSeats({ theatreId, movieId, showtime, date });
    const clash = selectedSeats.filter((seat) => currentBooked.includes(seat));
    if (clash.length > 0) {
      throw new Error(`Seats ${clash.join(', ')} were just reserved by another customer. Please choose different seats.`);
    }

    // Mark seats as booked in storage
    const updatedBooked = [...currentBooked, ...selectedSeats];
    localStorage.setItem(storageKey, JSON.stringify(updatedBooked));

    // Generate unique Booking ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `CP-${randomSuffix}`;

    const newBooking = {
      ...bookingData,
      id: bookingId,
      bookingId,
      movie: bookingData.movieTitle,
      customer: bookingData.customerName,
      theatre: bookingData.theatreName,
      showTime: bookingData.showtime,
      seats: bookingData.selectedSeats,
      amount: `$${Number(bookingData.grandTotal || 0).toFixed(2)}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    // Store in user bookings history
    const userBookingsKey = 'cinepass_user_bookings';
    const existing = JSON.parse(localStorage.getItem(userBookingsKey) || '[]');
    localStorage.setItem(userBookingsKey, JSON.stringify([newBooking, ...existing]));

    return newBooking;
  },

  /**
   * Module 8: Retrieve user booking history (combines session bookings with historical mock bookings)
   */
  getUserBookings() {
    try {
      const stored = JSON.parse(localStorage.getItem('cinepass_user_bookings') || '[]');
      // Merge with default mock bookings if not already present
      const storedIds = new Set(stored.map((b) => b.id || b.bookingId));
      const combined = [...stored];
      MOCK_RECENT_BOOKINGS.forEach((mock) => {
        if (!storedIds.has(mock.id)) {
          combined.push(mock);
        }
      });
      return combined;
    } catch {
      return MOCK_RECENT_BOOKINGS;
    }
  },

  /**
   * Module 8: Cancel a booking
   */
  cancelBooking(bookingId) {
    try {
      const all = this.getUserBookings();
      const updated = all.map((b) => {
        if (b.id === bookingId || b.bookingId === bookingId) {
          return { ...b, status: 'Cancelled' };
        }
        return b;
      });
      localStorage.setItem('cinepass_user_bookings', JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  /**
   * Module 9: Retrieve comprehensive box office reports & analytics metrics
   */
  async getAnalyticsData() {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const userBookings = this.getUserBookings();
    
    // Calculate total dynamic booking revenue
    const dynamicRevenue = userBookings.reduce((sum, b) => {
      if (b.status === 'Cancelled') return sum;
      const val = parseFloat(String(b.amount || '0').replace(/[^0-9.]/g, '')) || 0;
      return sum + val;
    }, 0);

    const baseRevenue = 64850;
    const totalRevenue = Math.round(baseRevenue + dynamicRevenue);
    const totalBookings = 1482 + userBookings.length;

    return {
      overview: {
        totalBookings,
        totalRevenue,
        todayBookings: 328 + userBookings.length,
        occupancyRate: "84.6%",
        averageTicketPrice: "$17.40",
        activeTheatres: 18,
        activeMovies: 24,
        totalShowsToday: 94
      },
      mostBookedMovie: {
        title: "Dune: Part Two",
        genre: "Sci-Fi / Adventure",
        director: "Denis Villeneuve",
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
        ticketsSold: 584,
        revenue: "$18,450",
        share: "34.8%",
        occupancyRate: "93.2%",
        rating: 8.6
      },
      mostPopularTheatre: {
        name: "PVR Superplex IMAX",
        city: "New York",
        screens: 16,
        formats: ["IMAX 70MM", "Dolby Atmos", "4DX"],
        occupancyRate: "94.2%",
        weeklyBookings: 462,
        weeklyRevenue: "$24,850",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80"
      },
      formatOccupancy: [
        { format: "IMAX 70MM", rate: 94.8, count: "18 Shows/day", color: "#f59e0b" },
        { format: "4DX Motion", rate: 89.2, count: "12 Shows/day", color: "#d97706" },
        { format: "Dolby Atmos", rate: 85.0, count: "24 Shows/day", color: "#b45309" },
        { format: "Executive Recliner", rate: 81.4, count: "16 Shows/day", color: "#eab308" },
        { format: "Laser 4K Standard", rate: 76.5, count: "24 Shows/day", color: "#78716c" }
      ],
      dailyTrends: [
        { day: "Mon", bookings: 210, revenue: 4200, occupancy: 72 },
        { day: "Tue", bookings: 255, revenue: 5100, occupancy: 76 },
        { day: "Wed", bookings: 240, revenue: 4800, occupancy: 74 },
        { day: "Thu", bookings: 320, revenue: 6400, occupancy: 82 },
        { day: "Fri", bookings: 445, revenue: 8900, occupancy: 91 },
        { day: "Sat", bookings: 570, revenue: 11400, occupancy: 97 },
        { day: "Sun", bookings: 510, revenue: 10200, occupancy: 94 }
      ],
      revenueByMovie: [
        { title: "Dune: Part Two", revenue: 18450, percentage: 34.8, bookings: 584, color: "#f59e0b" },
        { title: "Oppenheimer", revenue: 14200, percentage: 26.8, bookings: 430, color: "#d97706" },
        { title: "Spider-Man: Across the Spider-Verse", revenue: 11800, percentage: 22.3, bookings: 390, color: "#b45309" },
        { title: "Deadpool & Wolverine", revenue: 8650, percentage: 16.3, bookings: 290, color: "#ca8a04" }
      ],
      revenueByTier: [
        { tier: "Premiere Member", revenue: 38240, percentage: 59, count: 874 },
        { tier: "Executive Recliner", revenue: 26610, percentage: 41, count: 608 }
      ],
      theatreRankings: [
        { name: "PVR Superplex IMAX", city: "New York", screens: 16, occupancy: "94.2%", revenue: "$24,850", trend: "+12.4%" },
        { name: "AMC Empire Grand", city: "Los Angeles", screens: 20, occupancy: "91.8%", revenue: "$22,400", trend: "+9.1%" },
        { name: "Regal LA Live 4DX", city: "San Francisco", screens: 14, occupancy: "88.5%", revenue: "$18,900", trend: "+14.3%" },
        { name: "Cinepolis Premiere", city: "Chicago", screens: 12, occupancy: "86.0%", revenue: "$16,500", trend: "+6.8%" },
        { name: "Odeon Luxe Multiplex", city: "Miami", screens: 10, occupancy: "83.4%", revenue: "$13,200", trend: "+8.0%" },
        { name: "Alamo Drafthouse Cinema", city: "Dallas", screens: 8, occupancy: "80.9%", revenue: "$11,600", trend: "+5.2%" }
      ]
    };
  }
};
