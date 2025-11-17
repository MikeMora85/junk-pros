import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const logout = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    localStorage.removeItem('auth_token');
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
