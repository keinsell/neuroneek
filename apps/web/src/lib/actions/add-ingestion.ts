// This aciton will save the ingestion to local state, then local storage and
// in a free time request will be sent to the server to save the ingestion.

import { useIngestionStore } from '@/lib/store/ingestion-store';
import { Ingestion } from '@/types/ingestion';

export const addIngestion = (ingestion: Ingestion) => {
  useIngestionStore.getState().addIngestion(ingestion);
  const ingestions = useIngestionStore.getState().ingestions;
  localStorage.setItem('ingestions', JSON.stringify(ingestions));
  // This will be implemented in the future
};
