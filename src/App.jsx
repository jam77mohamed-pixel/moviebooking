import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MovieProvider } from './context/MovieContext';
import ProtectedRoute from './routes/ProtectedRoute';

import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import TheatresPage from './pages/TheatresPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingsPage from './pages/BookingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <MovieProvider>
            <Routes>
            {/* Public Auth Route (Module 1) */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Application Routes (Modules 2 through 9) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="movies" element={<MoviesPage />} />
              <Route path="movies/:id" element={<MovieDetailPage />} />
              <Route path="theatres" element={<TheatresPage />} />
              <Route path="seat-selection" element={<SeatSelectionPage />} />
              <Route path="booking/confirmation" element={<BookingConfirmationPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="watchlist" element={<MoviesPage />} />
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* Toast Notification Container */}
          <ToastContainer
            position="bottom-right"
            autoClose={3200}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </MovieProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;
