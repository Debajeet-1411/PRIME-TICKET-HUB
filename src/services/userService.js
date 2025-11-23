import authService from './authService';

class UserService {
    // Helper to get fresh user data from storage
    _getUserData(userId) {
        const users = authService.getAllUsers();
        return users.find(u => u.id === userId);
    }

    // Helper to save user data back to storage
    _saveUserData(updatedUser) {
        const users = authService.getAllUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            authService.saveUsers(users);

            // If this is the currently logged in user, update the session too
            const currentUser = authService.getCurrentUser();
            if (currentUser && currentUser.id === updatedUser.id) {
                const userSession = { ...updatedUser };
                delete userSession.password;
                localStorage.setItem('primeticket_current_user', JSON.stringify(userSession));
            }
            return true;
        }
        return false;
    }

    // Favorites Management
    getFavorites() {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return [];
        const user = this._getUserData(currentUser.id);
        return user?.favorites || [];
    }

    addToFavorites(movie) {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return false;

        const user = this._getUserData(currentUser.id);
        if (!user.favorites) user.favorites = [];

        // Check if already exists
        if (!user.favorites.some(fav => fav.id === movie.id)) {
            user.favorites.push(movie);
            this._saveUserData(user);
            return true;
        }
        return false;
    }

    removeFromFavorites(movieId) {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return false;

        const user = this._getUserData(currentUser.id);
        if (user.favorites) {
            user.favorites = user.favorites.filter(fav => fav.id !== movieId);
            this._saveUserData(user);
            return true;
        }
        return false;
    }

    isFavorite(movieId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.id === movieId);
    }

    // Bookings Management
    getBookings() {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return [];
        const user = this._getUserData(currentUser.id);
        return user?.bookings || [];
    }

    addBooking(bookingDetails) {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return false;

        const user = this._getUserData(currentUser.id);
        if (!user.bookings) user.bookings = [];

        const newBooking = {
            id: Date.now().toString(),
            ...bookingDetails,
            bookingDate: new Date().toISOString()
        };

        user.bookings.unshift(newBooking); // Add to beginning
        this._saveUserData(user);
        return newBooking;
    }
}

export default new UserService();
