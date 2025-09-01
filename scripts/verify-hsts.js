/**
 * HSTS Header Verification Script
 * Run this after deployment to verify HSTS headers are properly configured
 */

const https = require('https');
const http = require('http');

const DOMAIN = process.env.DOMAIN || 'calcverse.com';
const TIMEOUT = 10000; // 10 seconds

console.log('🔒 HSTS Header Verification Tool');
console.log('=' .repeat(50));

// Function to check HSTS header
function checkHSTS(url, callback) {
  const options = {
    hostname: DOMAIN,
    path: '/',
    method: 'HEAD',
    timeout: TIMEOUT
  };

  const client = url.startsWith('https') ? https : http;
  
  const req = client.request(options, (res) => {
    const hstsHeader = res.headers['strict-transport-security'];
    
    console.log(`\n📍 URL: ${url}`);
    console.log(`📋 Status: ${res.statusCode} ${res.statusMessage}`);
    
    if (hstsHeader) {
      console.log('✅ HSTS Header Found:');
      console.log(`   ${hstsHeader}`);
      
      // Parse HSTS header
      const maxAge = hstsHeader.match(/max-age=(\d+)/);
      const includeSubDomains = hstsHeader.includes('includeSubDomains');
      const preload = hstsHeader.includes('preload');
      
      console.log('📊 HSTS Configuration:');
      console.log(`   Max-Age: ${maxAge ? maxAge[1] + ' seconds (' + Math.floor(maxAge[1] / 31536000) + ' years)' : 'Not specified'}`);
      console.log(`   Include Subdomains: ${includeSubDomains ? '✅ Yes' : '❌ No'}`);
      console.log(`   Preload Eligible: ${preload ? '✅ Yes' : '❌ No'}`);
      
      // Validate configuration
      if (maxAge && parseInt(maxAge[1]) >= 31536000 && includeSubDomains) {
        console.log('🎉 HSTS Configuration: EXCELLENT');
        if (preload) {
          console.log('🚀 Ready for HSTS Preload List!');
        }
      } else {
        console.log('⚠️  HSTS Configuration: NEEDS IMPROVEMENT');
        if (!maxAge || parseInt(maxAge[1]) < 31536000) {
          console.log('   - Consider increasing max-age to at least 1 year');
        }
        if (!includeSubDomains) {
          console.log('   - Consider adding includeSubDomains directive');
        }
      }
    } else {
      console.log('❌ HSTS Header NOT Found');
      console.log('⚠️  This means:');
      console.log('   - Users are vulnerable to protocol downgrade attacks');
      console.log('   - First visit may be over HTTP');
      console.log('   - Not eligible for HSTS preload list');
    }
    
    callback();
  });

  req.on('error', (err) => {
    console.log(`❌ Error checking ${url}: ${err.message}`);
    callback();
  });

  req.on('timeout', () => {
    console.log(`⏰ Timeout checking ${url}`);
    req.destroy();
    callback();
  });

  req.end();
}

// Test both HTTP and HTTPS
async function runTests() {
  console.log(`🧪 Testing domain: ${DOMAIN}\n`);
  
  // Check HTTPS first
  await new Promise((resolve) => {
    checkHSTS(`https://${DOMAIN}`, resolve);
  });
  
  // Check HTTP redirect
  await new Promise((resolve) => {
    console.log('\n🔄 Checking HTTP to HTTPS redirect...');
    checkHSTS(`http://${DOMAIN}`, resolve);
  });
  
  console.log('\n🏁 HSTS Verification Complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. If HSTS is working, consider submitting to preload list:');
  console.log('   https://hstspreload.org/');
  console.log('2. Test with browser dev tools to verify client behavior');
  console.log('3. Monitor for any mixed content warnings');
}

// Handle command line arguments
if (process.argv[2]) {
  process.env.DOMAIN = process.argv[2].replace(/^https?:\/\//, '');
}

runTests().catch(console.error);