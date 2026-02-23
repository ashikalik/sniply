let googleScriptPromise: Promise<void> | null = null;

export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if ((window as Window & { google?: unknown }).google) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load Google Identity script')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Google Identity script'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export interface IGoogleCredentialResponse {
  credential?: string;
}

export interface IGoogleIdentityApi {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        callback: (response: IGoogleCredentialResponse) => void;
      }): void;
      renderButton(
        parent: HTMLElement,
        options: Record<string, string | number>,
      ): void;
    };
  };
}

export function getGoogleIdentityApi(): IGoogleIdentityApi | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return (window as Window & { google?: IGoogleIdentityApi }).google ?? null;
}
