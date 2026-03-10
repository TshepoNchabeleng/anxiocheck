// Import Play icon from lucide-react for the video play button overlay
import { Play } from "lucide-react";

// Import Card UI components for consistent styling across the app
import { Card, CardContent } from "../components/ui/card";

// Define the props (data) that VideoCard component expects to receive
// This ensures type safety and helps developers know what data to pass
interface VideoCardProps {
  title: string; // The title/name of the video
  thumbnail: string; // URL of the thumbnail image to display
  duration: string; // Video duration text (e.g., "5:23")
  category: string; // Category label (e.g., "Meditation", "Breathing")
  url?: string; // Optional YouTube URL to open when card is clicked
}

// VideoCard component displays a clickable video thumbnail with title and metadata
// Used in the dashboard to show mood-based video recommendations
export function VideoCard({ title, thumbnail, duration, category, url }: VideoCardProps) {
  // Handle click event to open video in new browser tab
  const handleClick = () => {
    // Only open URL if it exists (url is optional)
    if (url) {
      // Open in new tab with security flags (noopener prevents access to window.opener)
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    // Card wrapper - clickable, with hover shadow effect for visual feedback
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleClick} // Open video URL when card is clicked anywhere
    >
      {/* Thumbnail container with aspect ratio to maintain consistent sizing */}
      <div className="relative aspect-video bg-gray-200">
        {/* Video thumbnail image */}
        <img
          src={thumbnail} // URL from props
          alt={title} // Accessibility: describe image for screen readers
          className="w-full h-full object-cover" // Fill container while maintaining aspect ratio
        />
        
        {/* Play button overlay - only visible on hover (group-hover) */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Circular white background for play button */}
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            {/* Play icon - filled triangle pointing right */}
            <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Duration badge positioned in bottom-right corner */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {duration} {/* Display video duration text */}
        </div>
      </div>
      
      {/* Card content area below thumbnail */}
      <CardContent className="p-3">
        {/* Category label - small blue text above title */}
        <div className="text-xs text-blue-600 font-semibold mb-1">{category}</div>
        
        {/* Video title - line-clamp-2 limits to 2 lines with ellipsis */}
        <h4 className="font-semibold text-sm line-clamp-2">{title}</h4>
      </CardContent>
    </Card>
  );
}