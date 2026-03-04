const ENCRYPTION_KEY = 'financasia_v2_key';

export const securityService = {
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + ENCRYPTION_KEY);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const newHash = await securityService.hashPassword(password);
    return newHash === hash;
  },

  generateId(): string {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  },

  sanitizeInput(input: string): string {
    return input.replace(/[<>\"'&]/g, (char) => {
      const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
      return map[char] || char;
    });
  },

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePasswordStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 6) return { valid: false, message: 'Senha deve ter no mínimo 6 caracteres' };
    if (!/[A-Z]/.test(password)) return { valid: false, message: 'Senha deve ter pelo menos uma letra maiúscula' };
    if (!/[0-9]/.test(password)) return { valid: false, message: 'Senha deve ter pelo menos um número' };
    return { valid: true, message: 'Senha forte' };
  },

  generateSessionToken(): string {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  },

  // Rate limiting
  _loginAttempts: new Map<string, { count: number; firstAttempt: number }>(),

  checkLoginAttempts(email: string): boolean {
    const attempts = securityService._loginAttempts.get(email);
    if (!attempts) return true;
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - attempts.firstAttempt > fiveMinutes) {
      securityService._loginAttempts.delete(email);
      return true;
    }
    return attempts.count < 5;
  },

  recordLoginAttempt(email: string): void {
    const attempts = securityService._loginAttempts.get(email);
    if (!attempts) {
      securityService._loginAttempts.set(email, { count: 1, firstAttempt: Date.now() });
    } else {
      attempts.count++;
    }
  },

  clearLoginAttempts(email: string): void {
    securityService._loginAttempts.delete(email);
  },
};
