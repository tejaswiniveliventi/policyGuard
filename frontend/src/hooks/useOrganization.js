import { useAppStore } from '../store/appStore';

export function useOrganization() {
  const { organization, setOrganization, fetchOrganization } = useAppStore();

  return {
    organization,
    setOrganization,
    fetchOrganization,
  };
}