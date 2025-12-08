import { useRecoilCallback } from 'recoil';
import { authUserState } from '../state/atoms/authAtoms';
import { userState } from '../state/atoms/userAtom';
import { dashboardState } from '../state/atoms/dashboardAtoms';
import { practicesListState, practicesRefreshKeyState } from '../state/atoms/practicesAtoms';
import { questionsListState, questionsRefreshKeyState } from '../state/atoms/questionsAtoms';
import { subscriptionStatusState } from '../state/atoms/subscriptionsAtoms';
import { clearUserData } from '../utils/cleanup';

/**
 * Hook to reset all Recoil state atoms and clear localStorage
 * Call this on logout or when switching users
 * 
 * Note: atomFamily entries (like questionSelectionState) will be automatically
 * cleaned up when their parent atom (questionsListState) is reset, as they won't
 * be accessed anymore. Recoil handles this automatically.
 */
export function useResetState() {
  const resetAllState = useRecoilCallback(({ reset }) => () => {
    // Reset all atoms
    reset(authUserState);
    reset(userState);
    reset(dashboardState);
    reset(practicesListState);
    reset(practicesRefreshKeyState);
    reset(questionsListState);
    reset(questionsRefreshKeyState);
    reset(subscriptionStatusState);
    
    // Clear localStorage
    clearUserData();
  }, []);

  return resetAllState;
}

