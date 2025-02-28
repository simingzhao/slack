'use client';

import { useEffect } from 'react';
import { initializeDefaultProfile } from '@/lib/profile';

export function ProfileInitializer() {
  useEffect(() => {
    // Initialize default profile if none exists
    initializeDefaultProfile();
  }, []);

  // This component doesn't render anything
  return null;
} 