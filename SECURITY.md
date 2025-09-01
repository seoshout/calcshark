# Security Policy

## Security Measures Implemented

### 1. Content Security Policy (CSP)
- Strict CSP headers implemented in `next.config.js`
- Prevents XSS attacks by controlling resource loading
- Only allows trusted domains for scripts, styles, and images

### 2. Security Headers
- **X-Frame-Options**: DENY - Prevents clickjacking attacks
- **X-Content-Type-Options**: nosniff - Prevents MIME type sniffing
- **X-XSS-Protection**: 1; mode=block - Enables XSS filtering
- **Referrer-Policy**: strict-origin-when-cross-origin - Controls referrer information
- **Strict-Transport-Security**: HSTS enabled for HTTPS enforcement
  - Production: 2 years (63072000 seconds) with preload and includeSubDomains
  - Development: 1 year (31536000 seconds) with includeSubDomains only
  - Environment-aware configuration
- **Permissions-Policy**: Disabled unnecessary browser features

### 3. Input Validation & Sanitization
- All user inputs are validated and sanitized using `/lib/security.ts`
- Calculator inputs have strict validation with reasonable bounds
- Email and URL validation with security checks
- Protection against injection attacks

### 4. Rate Limiting
- Implemented client-side rate limiting in middleware
- API routes protected against abuse
- 100 requests per 15 minutes per IP address
- Configurable limits via environment variables

### 5. Secure Storage
- LocalStorage wrapper with input sanitization
- Prevents XSS through stored data
- Safe JSON parsing with error handling

### 6. Middleware Security
- Request filtering for suspicious user agents
- Blocked access to sensitive paths (/.env, /admin, etc.)
- Content-Type validation for POST requests
- IP-based rate limiting

### 7. Build Security
- Source maps disabled in production
- Powered-by header removed
- Compression enabled for performance
- Environment variable validation

### 8. HSTS (HTTP Strict Transport Security)
- **Purpose**: Forces browsers to use HTTPS for all connections
- **Implementation**: Environment-aware configuration
  - **Production**: `max-age=63072000; includeSubDomains; preload` (2 years)
  - **Development**: `max-age=31536000; includeSubDomains` (1 year, no preload)
- **Benefits**:
  - Prevents protocol downgrade attacks
  - Eliminates HTTP redirects to HTTPS
  - Protects against cookie hijacking
  - Eligible for browser preload lists
- **Configuration**: Applied via both `next.config.js` and `middleware.ts`

### 9. File Security
- Comprehensive `.gitignore` for sensitive files
- `robots.txt` blocks sensitive directories
- `security.txt` for responsible disclosure

## Vulnerability Assessment

### Checked For:
- ✅ SQL Injection (N/A - No database queries)
- ✅ XSS (Cross-Site Scripting) - Prevented by CSP and input sanitization
- ✅ CSRF (Cross-Site Request Forgery) - CSRF tokens implemented
- ✅ Clickjacking - Prevented by X-Frame-Options
- ✅ Information Disclosure - Error messages sanitized
- ✅ Insecure Dependencies - `npm audit` shows 0 vulnerabilities
- ✅ Insecure Direct Object References - Proper input validation
- ✅ Security Misconfiguration - Secure headers implemented
- ✅ Sensitive Data Exposure - No sensitive data stored client-side
- ✅ Broken Authentication - No authentication system (static site)

### Security Testing Results:
```bash
npm audit: 0 vulnerabilities found
```

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Email: security@calcverse.com
3. Or use GitHub Security Advisories: [Report Vulnerability](https://github.com/82lotterylogin/calcverse/security/advisories/new)

### What to Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

## Security Best Practices for Deployment

### Environment Variables
- Use `.env.local` for sensitive configuration
- Never commit secrets to version control
- Use Vercel's environment variable system for production

### HTTPS
- Always use HTTPS in production
- Configure HSTS headers properly
- Consider certificate pinning for additional security

### Monitoring
- Monitor for unusual traffic patterns
- Set up error tracking (consider Sentry)
- Regular security assessments

### Updates
- Keep dependencies updated
- Regularly run `npm audit`
- Monitor security advisories

## Security Checklist for Deployment

- [ ] Environment variables configured securely
- [ ] HTTPS enabled with proper certificates
- [ ] CSP headers configured and tested
- [ ] Rate limiting configured appropriately
- [ ] Error pages don't reveal sensitive information
- [ ] Security headers verified with tools like securityheaders.com
- [ ] Dependency vulnerabilities checked with `npm audit`
- [ ] Sensitive files properly excluded from deployment

## Security Configuration Files

- `next.config.js` - Security headers and CSP
- `middleware.ts` - Request filtering and rate limiting
- `lib/security.ts` - Input validation and secure utilities
- `.gitignore` - Sensitive file exclusion
- `robots.txt` - Crawler access control
- `security.txt` - Vulnerability disclosure policy

## Additional Security Considerations

### For Future Development:
- Implement proper authentication if user accounts are added
- Add database security measures if persistence is needed
- Consider implementing Web Application Firewall (WAF)
- Add security monitoring and alerting
- Implement proper session management
- Add API security measures (API keys, OAuth)

## Security Testing Commands

```bash
# Check for vulnerabilities in dependencies
npm audit

# Check for security headers (after deployment)
curl -I https://calcverse.com

# Test HSTS header specifically
curl -I https://calcverse.com | grep -i "strict-transport-security"

# Validate CSP
# Use browser dev tools or online CSP validators

# Test HSTS preload eligibility
# Visit: https://hstspreload.org/ and enter your domain
```

## HSTS Deployment Checklist

### Before Enabling HSTS:
- [ ] Ensure all subdomains support HTTPS
- [ ] Verify SSL certificate is properly configured
- [ ] Test that all resources load over HTTPS
- [ ] Check for mixed content warnings

### HSTS Configuration:
- [ ] HSTS header implemented in production
- [ ] `includeSubDomains` directive included
- [ ] `preload` directive included for production
- [ ] Appropriate max-age set (2 years for production)

### After Deployment:
- [ ] Verify HSTS header using browser dev tools
- [ ] Test forced HTTPS redirection
- [ ] Submit domain to HSTS preload list: https://hstspreload.org/
- [ ] Monitor for any HTTPS-related issues

## Contact

For security-related questions or concerns:
- Security Email: security@calcverse.com
- Project Maintainer: [GitHub Issues](https://github.com/82lotterylogin/calcverse/issues)

---

**Note**: This security implementation follows OWASP guidelines and industry best practices for static web applications.