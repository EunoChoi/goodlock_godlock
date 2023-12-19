import { create } from "zustand";

interface Props {
  modalStack: string[];

  push: (v: string) => void;
  pop: () => void;
  update: () => void;
}

export const useModalStack = create<Props>((set) => ({
  modalStack: [],

  push: (val: string) =>
    set((prev: Props) => {
      const temp = [...prev.modalStack];
      temp.push(val);
      return { modalStack: [...temp] };
    }),
  pop: () =>
    set((prev: Props) => {
      const temp = [...prev.modalStack];
      temp.pop();
      return { modalStack: [...temp] };
    }),

  update: () =>
    set((prev) => ({
      modalStack: [...prev.modalStack]
    }))
}));
