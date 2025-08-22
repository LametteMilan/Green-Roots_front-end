import axios from 'axios';

interface LoginResponse {
  token: string;
  userId: string;
  role: 'admin' | 'manager' | 'customer';
}


export const login = async (email: string, password: string): Promise<{ token: string; userId: string; role: 'admin' | 'manager' | 'customer' }> => {
  const response = await axios.post<LoginResponse>('/sessions', { email, password });
  return {
    token: response.data.token,
    userId: response.data.userId,
    role: response.data.role
  };
};

export const logout = async () => {
  await axios.delete('/');
};

export const verifySession = async () => {
  const response = await axios.get('/sessions/verify');
  return response.data;
};

// export const fetchUserProfile = async (userId: number, token: string) => {
//   try {
//     const response = await axios.get(`/users/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
      
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     throw error;
//   }
// };