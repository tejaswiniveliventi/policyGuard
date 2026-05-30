import { useAppStore } from '../store/appStore';

export function useAuth() {
  const { user, loading } = useAppStore();

  return {
    user,
    isAuthenticated: !!user,
    loading,
  };
}