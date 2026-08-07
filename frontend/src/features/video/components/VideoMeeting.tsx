import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { JaaSMeeting } from '@jitsi/react-sdk';
import { getVideoConfig } from '../api/getVideoConfig';
import type { VideoConfigResponseDTO } from '../types';
import { useJitsiAPI } from '../hooks/useJitsiAPI';
import type IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';

interface VideoMeetingProps {
  roomId: string;
  onClose?: () => void;
  onJitsiApiReady?: (api: IJitsiMeetExternalApi) => void;
}

export const VideoMeeting: React.FC<VideoMeetingProps> = ({ 
  roomId, 
  onClose, 
  onJitsiApiReady,
}) => {
  const [config, setConfig] = useState<VideoConfigResponseDTO | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<Error | null>(null);
  
  const apiRef = useRef<IJitsiMeetExternalApi | null>(null);

  // 1. Fetch meeting configuration
  useEffect(() => {
    let mounted = true;
    const fetchConfig = async () => {
      try {
        setConfigLoading(true);
        setConfigError(null);
        const data = await getVideoConfig(roomId);
        if (mounted) setConfig(data);
      } catch (err) {
        if (mounted) setConfigError(err as Error);
      } finally {
        if (mounted) setConfigLoading(false);
      }
    };
    fetchConfig();
    return () => {
      mounted = false;
    };
  }, [roomId]);

  // 2. Load Jitsi API script
  const { loading: apiLoading, error: apiError, JitsiMeetExternalAPI } = useJitsiAPI(config?.appId);

  // 3. Render states
  if (configLoading || (config && apiLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-[#0d1117] absolute inset-0">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm">
          {configLoading ? 'Fetching meeting config...' : 'Loading Jitsi API...'}
        </p>
      </div>
    );
  }

  if (configError || apiError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-[#0d1117] absolute inset-0 px-4 text-center">
        <p className="mb-2 text-red-400">Failed to initialize video meeting.</p>
        <p className="text-sm text-red-500 mb-4">
          {configError?.message || apiError?.message}
        </p>
        <button
          onClick={() => {
            setConfigLoading(true);
            setConfigError(null);
            getVideoConfig(roomId)
              .then(setConfig)
              .catch((err) => setConfigError(err as Error))
              .finally(() => setConfigLoading(false));
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!config || !JitsiMeetExternalAPI) {
    return null;
  }

  return (
    <div className="w-full h-full bg-[#0d1117] relative">
      <JaaSMeeting
        appId={config.appId}
        roomName={config.roomName}
        jwt={config.jwt}
        userInfo={{
          displayName: config.displayName,
          email: '', // Required by JaaSMeeting SDK
        }}
        configOverwrite={{
          disableLocalVideoFlip: true,
          backgroundAlpha: 0.5,
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          toolbarButtons: [
            'fullscreen',
            'profile',
            'settings',
            'tileview',
            'videoquality',
          ],
        }}
        interfaceConfigOverwrite={{
          VIDEO_LAYOUT_FIT: 'nocrop',
          MOBILE_APP_PROMO: false,
          TILE_VIEW_MAX_COLUMNS: 4,
          DISABLE_FOCUS_INDICATOR: true,
        }}
        onApiReady={(externalApi) => {
          apiRef.current = externalApi;
          onJitsiApiReady?.(externalApi);
          externalApi.addListener('readyToClose', () => {
            onClose?.();
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.width = '100%';
          iframeRef.style.height = '100%';
          iframeRef.style.border = 'none';
        }}
      />
    </div>
  );
};
