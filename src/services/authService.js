// User Authentication Service
const USERS_STORAGE_KEY = 'primeticket_users';
const CURRENT_USER_KEY = 'primeticket_current_user';

class AuthService {
    constructor() {
        this.initializeStorage();
    }

    // Initialize storage if it doesn't exist
    initializeStorage() {
        if (!localStorage.getItem(USERS_STORAGE_KEY)) {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        }
    }

    // Get all users
    getAllUsers() {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    }

    // Save users to storage
    saveUsers(users) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    // Register new user
    register(userData) {
        const { name, email, password, phone } = userData;

        // Validation
        if (!name || !email || !password) {
            return { success: false, message: 'All fields are required' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        const users = this.getAllUsers();

        // Check if email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In production, this should be hashed
            phone: phone || '',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        // Auto login after registration
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Registration successful', user: userWithoutPassword };
    }

    // Login user
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Store current user (without password)
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Login successful', user: userWithoutPassword };
    }

    // Logout user
    logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
        return { success: true, message: 'Logged out successfully' };
    }

    // Get current logged in user
    getCurrentUser() {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Update user profile
    updateProfile(userData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'No user logged in' };
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        // Update user data
        users[userIndex] = { ...users[userIndex], ...userData, id: currentUser.id };
        this.saveUsers(users);

        // Update current user
        const updatedUser = { ...users[userIndex] };
        delete updatedUser.password;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

        return { success: true, message: 'Profile updated successfully', user: updatedUser };
    }
}

export default new AuthService();
