export interface Sol {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  amount: number;
  memberCount: number;
  winnersPerRound: number;
  members: SolMember[];
  currentRound: number;
  startDate: string;
  status: "active" | "completed" | "paused";
}

export interface SolMember {
  id: string;
  name: string;
  position: number;
}

const STORAGE_KEY = "digital_sol_data";

export const solStorage = {
  getAllSols(): Sol[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading sols from storage:", error);
      return [];
    }
  },

  getSolById(id: string): Sol | null {
    const sols = this.getAllSols();
    return sols.find((sol) => sol.id === id) || null;
  },

  saveSol(sol: Sol): void {
    const sols = this.getAllSols();
    const existingIndex = sols.findIndex((s) => s.id === sol.id);
    
    if (existingIndex >= 0) {
      sols[existingIndex] = sol;
    } else {
      sols.push(sol);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sols));
  },

  deleteSol(id: string): void {
    const sols = this.getAllSols();
    const filtered = sols.filter((sol) => sol.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  updateSol(id: string, updates: Partial<Sol>): void {
    const sols = this.getAllSols();
    const index = sols.findIndex((sol) => sol.id === id);
    
    if (index >= 0) {
      sols[index] = { ...sols[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sols));
    }
  },
};
