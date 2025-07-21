import { api } from '@/lib/apiClient';

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
    const data = await api.post<any>('api/users/', userData, { requiresAuth: false });
    
    return {
      success: true,
      message: 'Account created successfully! You may now sign in. :)'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

// Update profile function
export async function updateUserProfile(profileData: { 
  first_name?: string;
  email?: string;
  username?: string;
}): Promise<{success: boolean; data?: any; error?: string; fieldErrors?: Record<string, string>}> {
  try {
    const data = await api.patch('api/user/profile/', profileData, { requiresAuth: true });
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    // Handle specific error formats from API
    if (error.response?.status === 400) {
      return {
        success: false,
        error: 'Validation error',
        fieldErrors: error.response.data
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to update profile'
    };
  }
}

// Change password function

export async function changePassword(passwordData: {
  old_password: string;
  new_password1: string;
  new_password2: string;
}): Promise<{success: boolean; message?: string; error?: string; fieldErrors?: Record<string, string>}> {
  try {
    await api.post('api/user/change-password/', passwordData, { requiresAuth: true });
    
    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error: any) {
    // Handle specific API error formats
    if (error.response?.status === 400) {
      return {
        success: false,
        error: 'Validation error',
        fieldErrors: error.response.data
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to change password'
    };
  }
}