import React, { useEffect, useRef } from 'react';
import '@google/model-viewer';

interface ModelViewerProps {
  src: string;
  alt?: string;
  cameraControls?: boolean;
  autoRotate?: boolean;
  shadowIntensity?: string;
  environmentImage?: string;
  exposure?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Wrapper component for @google/model-viewer to avoid TypeScript JSX issues
 * Uses a ref to manually create the custom element
 */
export const ModelViewer: React.FC<ModelViewerProps> = ({
  src,
  alt = '3D model',
  cameraControls = true,
  autoRotate = true,
  shadowIntensity = '1',
  environmentImage = 'neutral',
  exposure = '0.5',
  style,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Create model-viewer element
    const modelViewer = document.createElement('model-viewer');
    modelViewer.setAttribute('src', src);
    modelViewer.setAttribute('alt', alt);
    if (cameraControls) modelViewer.setAttribute('camera-controls', '');
    if (autoRotate) modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('shadow-intensity', shadowIntensity);
    modelViewer.setAttribute('environment-image', environmentImage);
    modelViewer.setAttribute('exposure', exposure);
    
    // Apply styles
    if (style) {
      Object.assign(modelViewer.style, {
        width: style.width || '100%',
        height: style.height || '100%',
      });
    } else {
      modelViewer.style.width = '100%';
      modelViewer.style.height = '100%';
    }

    containerRef.current.appendChild(modelViewer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [src, alt, cameraControls, autoRotate, shadowIntensity, environmentImage, exposure]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={style}
    />
  );
};

export default ModelViewer;
