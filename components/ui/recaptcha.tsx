'use client';

import React, { useEffect, useRef } from 'react';

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
}

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad?: () => void;
  }
}

export default function ReCaptcha({
  onVerify,
  onExpire,
  onError,
  className = ""
}: ReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key missing. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.');
      return;
    }

    let isMounted = true;
    const cleanups: Array<() => void> = [];

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.grecaptcha?.render) return;

      // If already rendered, just reset instead of re-rendering
      if (widgetIdRef.current !== null && window.grecaptcha.reset) {
        window.grecaptcha.reset(widgetIdRef.current);
        return;
      }

      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerify(token),
        'expired-callback': () => onExpire?.(),
        'error-callback': () => onError?.(),
        theme: 'light',
      });
    };

    // Load script if not already present
    if (!document.getElementById('recaptcha-script')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      script.onerror = () => onError?.();
      document.head.appendChild(script);
      cleanups.push(() => {
        script.onload = null;
        script.onerror = null;
      });
    } else if (window.grecaptcha?.render) {
      renderWidget();
    } else {
      // Script is present but not ready yet; wait for load event
      const existingScript = document.getElementById('recaptcha-script');
      const handleLoad = () => renderWidget();
      existingScript?.addEventListener('load', handleLoad);
      cleanups.push(() => existingScript?.removeEventListener('load', handleLoad));
    }

    // Cleanup
    return () => {
      isMounted = false;
      cleanups.forEach((fn) => fn());
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    };
    }, [onVerify, onExpire, onError]);

  if (!siteKey) {
    return (
      <div className={className}>
        <div className="text-sm text-red-600 dark:text-red-400">
          reCAPTCHA not configured. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={containerRef} aria-label="reCAPTCHA verification" />
    </div>
  );
}

// Helper function to verify reCAPTCHA token on the server
export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}
