'use client';

import * as React from 'react';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type ToastState = ToastProps & { id: string; open: boolean };

const listeners: Array<(toasts: ToastState[]) => void> = [];
let memoryState: ToastState[] = [];

function dispatch(toasts: ToastState[]) {
  memoryState = toasts;
  listeners.forEach((listener) => listener(toasts));
}

export function toast(props: ToastProps) {
  const id = Math.random().toString(36).slice(2);
  const newToast: ToastState = { ...props, id, open: true };
  dispatch([...memoryState, newToast]);
  setTimeout(() => {
    dispatch(memoryState.filter((t) => t.id !== id));
  }, 4000);
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastState[]>(memoryState);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { toasts, toast };
}
