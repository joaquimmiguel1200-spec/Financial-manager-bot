import type { User, UserSession, FixedEntry } from '@/types';
import { securityService } from './securityService';

const USERS_KEY = 'financas_users_v2';
const SESSION_KEY = 'financas_session_v2';
const SESSION_TOKEN_KEY = 'financas_token';

export const authService = {
  getUsers(): User[] {
    try {
      return securityService.safeJSONParse(localStorage.getItem(USERS_KEY) || '[]', []);
    } catch { return []; }
  },

  async saveUsers(users: User[]): Promise<void> {
    const data = JSON.stringify(users);
    await securityService.saveWithIntegrity(USERS_KEY, data);
  },

  async register(name: string, email: string, password: string): Promise<{ success: boolean; message: string }> {
    // Input validation
    const sanitizedName = securityService.sanitizeInput(name.trim());
    const sanitizedEmail = email.trim().toLowerCase();
    
    if (!sanitizedName || sanitizedName.length < 2) return { success: false, message: 'Nome deve ter pelo menos 2 caracteres' };
    if (!securityService.validateEmail(sanitizedEmail)) return { success: false, message: 'Email inválido' };
    const strength = securityService.validatePasswordStrength(password);
    if (!strength.valid) return { success: false, message: strength.message };

    const users = authService.getUsers();
    // Anti-enumeration: don't reveal if email exists (but we need to prevent duplicates)
    if (users.find(u => u.email === sanitizedEmail)) {
      securityService.logSecurityEvent('register_duplicate_email', sanitizedEmail);
      return { success: false, message: 'Email já cadastrado' };
    }

    const hash = await securityService.hashPassword(password);
    const user: User = {
      id: securityService.generateId(),
      email: sanitizedEmail,
      name: sanitizedName,
      password: hash,
      createdAt: new Date().toISOString(),
      fixedIncomes: [],
      fixedExpenses: [],
    };

    users.push(user);
    await authService.saveUsers(users);
    authService.createSession(user);
    securityService.logSecurityEvent('register_success', sanitizedEmail);
    return { success: true, message: 'Conta criada com sucesso!' };
  },

  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    
    const rateCheck = securityService.checkLoginAttempts(normalizedEmail);
    if (!rateCheck.allowed) {
      securityService.logSecurityEvent('login_rate_limited', normalizedEmail);
      return { success: false, message: `Muitas tentativas. Aguarde ${rateCheck.waitSeconds} segundos.` };
    }

    const users = authService.getUsers();
    const user = users.find(u => u.email === normalizedEmail);
    
    // Anti-enumeration: same error message whether user exists or not
    if (!user) {
      securityService.recordLoginAttempt(normalizedEmail);
      securityService.logSecurityEvent('login_failed_unknown_email', normalizedEmail);
      return { success: false, message: 'Email ou senha incorretos' };
    }

    const valid = await securityService.verifyPassword(password, user.password);
    if (!valid) {
      securityService.recordLoginAttempt(normalizedEmail);
      securityService.logSecurityEvent('login_failed_wrong_password', normalizedEmail);
      return { success: false, message: 'Email ou senha incorretos' };
    }

    // If user has legacy hash, upgrade to PBKDF2
    if (!user.password.startsWith('pbkdf2:')) {
      user.password = await securityService.hashPassword(password);
      await authService.saveUsers(users);
      securityService.logSecurityEvent('password_hash_upgraded', normalizedEmail);
    }

    securityService.clearLoginAttempts(normalizedEmail);
    authService.createSession(user);
    securityService.logSecurityEvent('login_success', normalizedEmail);
    return { success: true, message: 'Login realizado!' };
  },

  createSession(user: User): void {
    securityService.createSecureSession(user.id, user.email, user.name);
    securityService.generateCSRFToken();
  },

  getSession(): UserSession | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      const session = securityService.safeJSONParse<UserSession & { expiresAt?: number }>(data, null as unknown as UserSession);
      if (!session) return null;
      
      // Validate session integrity
      if (!securityService.validateSession()) return null;
      
      return { id: session.id, email: session.email, name: session.name };
    } catch { return null; }
  },

  logout(): void {
    securityService.logSecurityEvent('logout');
    securityService.destroySession();
  },

  getCurrentUser(): User | null {
    const session = authService.getSession();
    if (!session) return null;
    return authService.getUsers().find(u => u.id === session.id) || null;
  },

  updateUserProfile(name: string): boolean {
    const session = authService.getSession();
    if (!session) return false;
    const users = authService.getUsers();
    const idx = users.findIndex(u => u.id === session.id);
    if (idx === -1) return false;
    users[idx].name = securityService.sanitizeInput(name);
    authService.saveUsers(users);
    // Update session
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (rawSession) {
      const s = JSON.parse(rawSession);
      s.name = users[idx].name;
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    }
    return true;
  },

  updateFixedIncomes(incomes: FixedEntry[]): boolean {
    const session = authService.getSession();
    if (!session) return false;
    const users = authService.getUsers();
    const idx = users.findIndex(u => u.id === session.id);
    if (idx === -1) return false;
    users[idx].fixedIncomes = incomes;
    authService.saveUsers(users);
    return true;
  },

  updateFixedExpenses(expenses: FixedEntry[]): boolean {
    const session = authService.getSession();
    if (!session) return false;
    const users = authService.getUsers();
    const idx = users.findIndex(u => u.id === session.id);
    if (idx === -1) return false;
    users[idx].fixedExpenses = expenses;
    authService.saveUsers(users);
    return true;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const user = authService.getCurrentUser();
    if (!user) return { success: false, message: 'Usuário não encontrado' };
    const valid = await securityService.verifyPassword(currentPassword, user.password);
    if (!valid) return { success: false, message: 'Senha atual incorreta' };
    const strength = securityService.validatePasswordStrength(newPassword);
    if (!strength.valid) return { success: false, message: strength.message };
    const users = authService.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    users[idx].password = await securityService.hashPassword(newPassword);
    await authService.saveUsers(users);
    securityService.logSecurityEvent('password_changed', user.email);
    return { success: true, message: 'Senha alterada com sucesso!' };
  },

  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    const user = authService.getCurrentUser();
    if (!user) return { success: false, message: 'Usuário não encontrado' };
    const valid = await securityService.verifyPassword(password, user.password);
    if (!valid) return { success: false, message: 'Senha incorreta' };
    const users = authService.getUsers().filter(u => u.id !== user.id);
    await authService.saveUsers(users);
    localStorage.removeItem(`financasia_transactions_${user.id}`);
    localStorage.removeItem(`financasia_goals_${user.id}`);
    localStorage.removeItem(`financasia_transactions_${user.id}_checksum`);
    localStorage.removeItem(`financasia_goals_${user.id}_checksum`);
    securityService.logSecurityEvent('account_deleted', user.email);
    authService.logout();
    return { success: true, message: 'Conta excluída com sucesso' };
  },
};
