import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'


const profileStore = create()(
  persist(
    (set, get) => ({
      profile : null,
      access_token : null,
      setProfile: (params) => set((p) => ({ profile: params })),
      logout: () => set((p) => ({ profile: null, access_token: null })),
      setAccessToken: (params) => set((p) => ({access_token: params}))
    }),
    {
      name: 'profile', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used

    },
  ),
)
export default profileStore;