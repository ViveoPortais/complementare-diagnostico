import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionStore = {
  isLogged: boolean;
  email: string;
  role: string;
  name: string;
  token: string;
  changePassword: boolean;
  currentPassword: string;
  session?: string;
  ticket?: string;
  nameInactive?: string;
  crmInactive?: string;
  inactiveType?: string;
  refresh: boolean;
  motivo?: string;
  setMotivo: (motivo: string) => void;
  setNameInactive: (nameInactive: string) => void;
  setCrmInactive: (crmInactive: string) => void;
  setRefresh: (refresh: boolean) => void;
  setInactiveType: (inactiveType: string) => void;
  setTicket: (ticket: string) => void;
  setSession: (session: string) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: string) => void;
  setToken: (token: string) => void;
  setChangePassword: (changePassword: boolean) => void;
  setCurrentPassword: (currentPassword: string) => void;
  onLogin: () => void;
  onLogout: () => void;
};

const useSession = create(
  persist<SessionStore>(
    (set) => ({
      isLogged: false,
      email: "",
      role: "",
      name: "",
      token: "",
      changePassword: false,
      currentPassword: "",
      session: "",
      ticket: "",
      inactiveType: "",
      refresh: false,
      motivo: "",
      setMotivo: (motivo) => set({ motivo: motivo }),
      setNameInactive: (nameInactive) => set({ nameInactive: nameInactive }),
      setCrmInactive: (crmInactive) => set({ crmInactive: crmInactive }),
      setRefresh: (refresh) => set({ refresh: refresh }),
      setInactiveType: (inactiveType) => set({ inactiveType: inactiveType }),
      setTicket: (ticket) => set({ ticket: ticket }),
      setSession: (session) => set({ session: session }),
      setCurrentPassword: (currentPassword) =>
        set({ currentPassword: currentPassword }),
      setName: (name) => set({ name: name }),
      setRole: (role) => set({ role: role }),
      setEmail: (email: string) => set({ email: email }),
      setToken: (token) => set({ token: token }),
      onLogin: () => set({ isLogged: true }),
      onLogout: () =>
        set({
          isLogged: false,
          token: "",
          email: "",
          role: "",
          name: "",
          changePassword: false,
          currentPassword: "",
          inactiveType: "",
        }),
      setChangePassword: (changePassword) =>
        set({ changePassword: changePassword }),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSession;
