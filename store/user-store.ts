import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Data = {
  id: string;
  token: string;
};

interface store {
  _hasHydrated: boolean;
  setUser: (data: Data | null) => void;
  user: Data | null;
}

const useUserStore = create(
  persist<store>(
    (set) => ({
      _hasHydrated: false,
      user: null,
      setUser: (data: Data | null) => {
        set({ user: data });
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);

export { useUserStore };
