import { useDiscoveryStore } from '../store/discoveryStore';

export function useDiscovery() {
  const {
    currentSection,
    discovery,
    setCurrentSection,
    updateDiscovery,
    addAISystem,
    submitDiscovery,
  } = useDiscoveryStore();

  return {
    currentSection,
    discovery,
    setCurrentSection,
    updateDiscovery,
    addAISystem,
    submitDiscovery,
  };
}