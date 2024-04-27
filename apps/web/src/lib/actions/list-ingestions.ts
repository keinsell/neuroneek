import { useIngestionStore } from '@/lib/store/ingestion-store';

export const listIngestions = () => {
  // Fetch all ingestion's from the store
  const currentIngestion = useIngestionStore.getState().ingestions;
  return currentIngestion;
};
