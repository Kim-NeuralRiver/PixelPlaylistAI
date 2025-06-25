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

// Update profile function
export async function updateUserProfile(profileData: { 
  first_name?: string;
  email?: string;
}): Promise<{success: boolean; data?: any; error?: string; fieldErrors?: Record<string, string>}> {
  try {
    const token = await tokenManager.ensureValidToken();
    const response = await fetch(`${BASE_URL}/api/user/profile/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // error 400s with field-specific validation messages
      if (response.status === 400) {
        return {
          success: false,
          error: 'Validation error',
          fieldErrors: data 
        };
      }
      
      return {
        success: false,
        error: data.detail || data.message || 'Failed to update profile'
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Network error: ' + (error.message || 'An unexpected error occurred')
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
    const token = await tokenManager.ensureValidToken();
    const response = await fetch(`${BASE_URL}/api/user/change-password/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle specific error status codes
      if (response.status === 400) {
        return {
          success: false,
          error: 'Validation error',
          fieldErrors: data // Field-specific errors
        };
      } else if (response.status === 429) {
        return {
          success: false,
          error: 'Too many attempts. Please try again later.'
        };
      }
      
      return {
        success: false,
        error: data.detail || data.message || 'Failed to change password'
      };
    }
    
    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Network error: ' + (error.message || 'An unexpected error occurred')
    };
  }
}