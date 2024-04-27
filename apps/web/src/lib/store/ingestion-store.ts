import { createStore } from 'zustand';
import { Ingestion } from '@/types/ingestion';


type IngestionStore = {
  ingestions: Ingestion[];
  addIngestion: (ingestion: Ingestion) => void;
  removeIngestion: (id: string) => void;
  updateIngestion: (id: string, update: Partial<Ingestion>) => void;
};

export const useIngestionStore = createStore<IngestionStore>((set) => ({
  ingestions: [],
  addIngestion: (ingestion) =>
    set((state) => ({ ingestions: [...state.ingestions, ingestion] })),
  removeIngestion: (id) =>
    set((state) => ({
      ingestions: state.ingestions.filter((ingestion) => ingestion.id !== id),
    })),
  updateIngestion: (id, update) =>
    set((state) => ({
      ingestions: state.ingestions.map((ingestion) =>
        ingestion.id === id ? { ...ingestion, ...update } : ingestion,
      ),
    })),
}));
