import { useState, useRef, MouseEvent } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageZoom({ src, alt, className }: ImageZoomProps) {
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setZoomStyle({});
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)",
    });
  };

  return (
    <div className="relative overflow-hidden group">
      <div
        ref={imageRef}
        className={`relative overflow-hidden cursor-zoom-in ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
            isZooming ? "scale-250" : "scale-100"
          }`}
          style={isZooming ? zoomStyle : {}}
        />

        {/* Zoom Indicator */}
        {!isZooming && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <Path d="m21 21-4.3-4.3" />
                <circle cx="11" cy="11" r="3" />
              </svg>
              Hover to zoom
            </span>
          </div>
        )}
      </div>

      {/* Zoomed Image Display - Amazon Style */}
      {isZooming && (
        <div className="absolute left-full top-0 ml-4 w-96 h-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <img
            src={src}
            alt={`${alt} - Zoomed`}
            className="w-full h-full object-cover transform scale-250"
            style={zoomStyle}
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            Zoomed View
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for SVG path
function Path({ d }: { d: string }) {
  return <path d={d} />;
}
