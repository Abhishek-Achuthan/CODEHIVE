import { useState, useEffect } from 'react';



let scriptPromise: Promise<void> | null = null;

export const useJitsiAPI = (appId?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!appId) {
      setLoading(true);
      return;
    }

    let mounted = true;
    setLoading(true);

    const loadScript = async () => {
      if (window.JitsiMeetExternalAPI) {
        if (mounted) setLoading(false);
        return;
      }

      if (!scriptPromise) {
        scriptPromise = new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(`https://8x8.vc/${appId}/external_api.js`);
            if (!response.ok) {
              throw new Error(`Failed to load Jitsi external API script: ${response.status}`);
            }
            const scriptText = await response.text();

            // Temporarily hide define, module, and exports to force the Jitsi UMD 
            // wrapper to take the global (window) branch instead of the AMD/CommonJS branch.
            const originalDefine = (window as any).define;
            const originalExports = (window as any).exports;
            const originalModule = (window as any).module;

            (window as any).define = undefined;
            (window as any).exports = undefined;
            (window as any).module = undefined;

            const script = document.createElement('script');
            // By setting .text instead of .src, the script is evaluated synchronously 
            // the exact moment it is appended to the DOM. This prevents any race 
            // conditions with Monaco or other async module loaders.
            script.text = scriptText;
            document.head.appendChild(script);

            // Restore the original globals immediately after synchronous execution
            (window as any).define = originalDefine;
            (window as any).exports = originalExports;
            (window as any).module = originalModule;

            if (window.JitsiMeetExternalAPI) {
              resolve();
            } else {
              reject(new Error('Jitsi API failed to initialize globally'));
            }
          } catch (err) {
            scriptPromise = null;
            reject(err);
          }
        });
      }

      try {
        await scriptPromise;
        if (mounted) setLoading(false);
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    loadScript();

    return () => {
      mounted = false;
    };
  }, [appId]);

  return { 
    loading, 
    error, 
    JitsiMeetExternalAPI: window.JitsiMeetExternalAPI 
  };
};
