import { Play } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  url?: string;
}

export function VideoCard({ title, thumbnail, duration, category, url }: VideoCardProps) {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative aspect-video bg-gray-200">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
          </div>
        </div>
        
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="text-xs text-blue-600 font-semibold mb-1">{category}</div>
        <h4 className="font-semibold text-sm line-clamp-2">{title}</h4>
      </CardContent>
    </Card>
  );
}