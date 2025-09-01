/**
 * Security utilities for input validation and sanitization
 */

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length to prevent DoS
};

// Email validation with security checks
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.length <= 254;
};

// URL validation with security checks
export const validateURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// Calculator input validation
export const validateCalculatorInput = (input: string | number): number | null => {
  if (typeof input === 'number') {
    // Check for valid number ranges
    if (isNaN(input) || !isFinite(input)) return null;
    if (input < -1e10 || input > 1e10) return null; // Reasonable bounds
    return input;
  }
  
  if (typeof input === 'string') {
    const sanitized = sanitizeInput(input);
    const parsed = parseFloat(sanitized);
    
    if (isNaN(parsed) || !isFinite(parsed)) return null;
    if (parsed < -1e10 || parsed > 1e10) return null;
    return parsed;
  }
  
  return null;
};

// Secure localStorage wrapper
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      if (typeof window === 'undefined') return;
      
      const sanitizedKey = sanitizeInput(key);
      const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : JSON.stringify(value);
      
      localStorage.setItem(sanitizedKey, sanitizedValue);
    } catch (error) {
      console.error('Secure storage error:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      
      const sanitizedKey = sanitizeInput(key);
      return localStorage.getItem(sanitizedKey);
    } catch (error) {
      console.error('Secure storage error:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Secure storage error:', error);
    }
  }
};

// Rate limiting for API calls (client-side basic implementation)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

export const rateLimiter = new RateLimiter();

// Content Security Policy nonce generator (for server-side rendering)
export const generateNonce = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }
  
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// HSTS configuration
export const hstsConfig = {
  development: 'max-age=31536000; includeSubDomains', // 1 year, no preload for dev
  production: 'max-age=63072000; includeSubDomains; preload', // 2 years with preload for production
};

// Get HSTS header value based on environment
export const getHSTSHeader = (): string => {
  return process.env.NODE_ENV === 'production' 
    ? hstsConfig.production 
    : hstsConfig.development;
};

// Secure headers for API routes
export const secureHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'Strict-Transport-Security': getHSTSHeader(),
  'X-Permitted-Cross-Domain-Policies': 'none',
};

// Error message sanitization (prevent information disclosure)
export const sanitizeErrorMessage = (error: unknown): string => {
  if (process.env.NODE_ENV === 'production') {
    return 'An error occurred. Please try again.';
  }
  
  if (error instanceof Error) {
    return sanitizeInput(error.message);
  }
  
  return 'Unknown error occurred';
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return generateNonce();
};

export const validateCSRFToken = (token: string, expectedToken: string): boolean => {
  return token === expectedToken && token.length > 0;
};