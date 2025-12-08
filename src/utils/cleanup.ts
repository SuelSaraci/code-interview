/**
 * Utility functions for cleaning up user state on logout
 */

/**
 * Clears all localStorage items related to user data
 */
export function clearLocalStorage() {
  // Clear user progress
  localStorage.removeItem('userProgress');
  
  // Clear user preferences
  localStorage.removeItem('userPreferences');
  
  // Clear onboarding status
  localStorage.removeItem('onboardingCompleted');
  
  // Clear any other user-specific data
  // Note: We don't clear all localStorage as there might be other app-wide settings
}

/**
 * Clears all user-related data from localStorage and returns a list of cleared items
 */
export function clearUserData(): string[] {
  const cleared: string[] = [];
  
  const itemsToClear = [
    'userProgress',
    'userPreferences',
    'onboardingCompleted',
  ];
  
  itemsToClear.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      cleared.push(key);
    }
  });
  
  return cleared;
}

