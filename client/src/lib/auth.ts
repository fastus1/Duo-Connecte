export function isAuthenticated(): boolean {
  const token = localStorage.getItem('session_token');
  const timestamp = localStorage.getItem('session_timestamp');
  
  if (!token || !timestamp) {
    return false;
  }

  const elapsed = Date.now() - parseInt(timestamp);
  const sessionTimeout = 60 * 60 * 1000;
  
  if (elapsed > sessionTimeout) {
    clearAuth();
    return false;
  }

  return true;
}

export function clearAuth(): void {
  localStorage.removeItem('session_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('is_admin');
  localStorage.removeItem('session_timestamp');
  // Also clear Circle.so cache to force fresh data on next login
  localStorage.removeItem('circle_user_data');
  localStorage.removeItem('circle_user_timestamp');
}

export function getSessionToken(): string | null {
  return localStorage.getItem('session_token');
}

export function getUserId(): string | null {
  return localStorage.getItem('user_id');
}
