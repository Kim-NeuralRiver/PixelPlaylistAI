import { tokenManager } from './tokenManager';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface RegisterUserData {
    username: string;
    email: string;
    password: string;
    name?: string;
}

export interface RegisterResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export async function registerUser(userData: RegisterUserData): Promise<RegisterResponse> {
    try {
        const response = await fetch(`${BASE_URL}/api/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.message || 'Sign up failed'
            };
        }

        return {
            success: true,
            message: 'Account created successfully! You may now sign in. :)'
        };
    } catch (error: any) {
        return {
            success: false,
            error: 'Network error: ' + (error.message || 'An unexpected error occurred')
        }
    }
}