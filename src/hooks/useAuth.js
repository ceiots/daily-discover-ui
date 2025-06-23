import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api/authService'; 
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAuthResponse = (response) => {
        // Assuming the API returns { success: true, data: { user, token } }
        const { user: userData, token } = response.data;
        setUser(userData);
        localStorage.setItem('authToken', token);
        return response;
    };

    const login = useCallback(async (credentials) => {
        setIsLoading(true);
        try {
            const response = await apiLogin(credentials);
            toast.success('Login successful!');
            return handleAuthResponse(response);
        } catch (error) {
            toast.error(error.message || 'Login failed.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (userData) => {
        setIsLoading(true);
        try {
            const response = await apiRegister(userData);
            toast.success('Registration successful!');
            return handleAuthResponse(response);
        } catch (error) {
            toast.error(error.message || 'Registration failed.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('authToken');
        toast.success('Logged out successfully.');
    }, []);

    const value = useMemo(() => ({
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    }), [user, isLoading, login, register, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 