import type { User, UserSession, FixedEntry } from '@/types';
import { securityService } from './securityService';

const USERS_KEY = 'financas_users_v2';
const SESSION_KEY = 'financas_session_v2';
const SESSION_TOKEN_KEY = 'financas_token';

export const authService = {
  getUsers(): User[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch { return []; }
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  async register(name: string, email: string, password: string): Promise<{ success: boolean; message: string }> {
    if (!securityService.validateEmail(email)) return { success: false, message: 'Email inválido' };
    const strength = securityService.validatePasswordStrength(password);
    if (!strength.valid) return { success: false, message: strength.message };

    const users = authService.getUsers();
    if (users.find(u => u.email === email)) return { success: false, message: 'Email já cadastrado' };

    const hash = await securityService.hashPassword(password);
    const user: User = {
      id: securityService.generateId(),
      email: securityService.sanitizeInput(email),
      name: securityService.sanitizeInput(name),
      password: hash,
      createdAt: new Date().toISOString(),
      fixedIncomes: [],
      fixedExpenses: [],
    };

    users.push(user);
    authService.saveUsers(users);
    authService.createSession(user);
    return { success: true, message: 'Conta criada com sucesso!' };
  },

  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    if (!securityService.checkLoginAttempts(email)) {
      return { success: false, message: 'Muitas tentativas. Aguarde 5 minutos.' };
    }

    const users = authService.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      securityService.recordLoginAttempt(email);
      return { success: false, message: 'Email ou senha incorretos' };
    }

    const valid = await securityService.verifyPassword(password, user.password);
    if (!valid) {
      securityService.recordLoginAttempt(email);
      return { success: false, message: 'Email ou senha incorretos' };
    }

    securityService.clearLoginAttempts(email);
    authService.createSession(user);
    return { success: true, message: 'Login realizado!' };
  },

  createSession(user: User): void {
    const session: UserSession = { id: user.id, email: user.email, name: user.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_TOKEN_KEY, securityService.generateSessionToken());
  },

  getSession(): UserSession | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
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
    session.name = users[idx].name;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
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
    authService.saveUsers(users);
    return { success: true, message: 'Senha alterada com sucesso!' };
  },

  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    const user = authService.getCurrentUser();
    if (!user) return { success: false, message: 'Usuário não encontrado' };
    const valid = await securityService.verifyPassword(password, user.password);
    if (!valid) return { success: false, message: 'Senha incorreta' };
    const users = authService.getUsers().filter(u => u.id !== user.id);
    authService.saveUsers(users);
    localStorage.removeItem(`financasia_transactions_${user.id}`);
    localStorage.removeItem(`financasia_goals_${user.id}`);
    authService.logout();
    return { success: true, message: 'Conta excluída com sucesso' };
  },
};
