import { VideoSourceType } from "@/hooks/useCourses";

interface VideoPlayerProps {
  videoUrl: string;
  videoSourceType?: VideoSourceType;
  className?: string;
}

// Extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// Extract Vimeo video ID from various URL formats
function getVimeoVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /^(\d+)$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// Auto-detect video source type from URL
function detectVideoSourceType(url: string): VideoSourceType {
  if (!url) return 'youtube';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  
  // Check if it's a direct video file URL
  if (url.match(/\.(mp4|webm|ogg|mov)(\?|$)/i) || url.includes('supabase')) {
    return 'upload';
  }
  
  return 'youtube';
}

export function VideoPlayer({ videoUrl, videoSourceType, className = "" }: VideoPlayerProps) {
  // Auto-detect if not specified
  const sourceType = videoSourceType || detectVideoSourceType(videoUrl);
  
  if (!videoUrl) {
    return (
      <div className={`aspect-video bg-muted flex items-center justify-center rounded-lg ${className}`}>
        <p className="text-muted-foreground">ভিডিও উপলব্ধ নেই</p>
      </div>
    );
  }

  switch (sourceType) {
    case 'youtube': {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) {
        return (
          <div className={`aspect-video bg-muted flex items-center justify-center rounded-lg ${className}`}>
            <p className="text-muted-foreground">অবৈধ YouTube URL</p>
          </div>
        );
      }
      return (
        <iframe
          className={`aspect-video w-full rounded-lg ${className}`}
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }

    case 'vimeo': {
      const videoId = getVimeoVideoId(videoUrl);
      if (!videoId) {
        return (
          <div className={`aspect-video bg-muted flex items-center justify-center rounded-lg ${className}`}>
            <p className="text-muted-foreground">অবৈধ Vimeo URL</p>
          </div>
        );
      }
      return (
        <iframe
          className={`aspect-video w-full rounded-lg ${className}`}
          src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0`}
          title="Vimeo video player"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
        />
      );
    }

    case 'upload': {
      return (
        <video
          className={`aspect-video w-full rounded-lg bg-black ${className}`}
          src={videoUrl}
          controls
          controlsList="nodownload"
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          আপনার ব্রাউজার ভিডিও সাপোর্ট করে না
        </video>
      );
    }

    default:
      return (
        <div className={`aspect-video bg-muted flex items-center justify-center rounded-lg ${className}`}>
          <p className="text-muted-foreground">অজানা ভিডিও ফরম্যাট</p>
        </div>
      );
  }
}

export default VideoPlayer;