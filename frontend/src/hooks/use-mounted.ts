'use client';

import { useEffect, useState } from 'react';

/** Avoid SSR/client mismatches on form fields (e.g. browser extension attributes). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
