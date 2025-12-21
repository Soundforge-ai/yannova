// Type declarations for @google/model-viewer
import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'camera-controls'?: boolean | string;
          'auto-rotate'?: boolean | string;
          'auto-rotate-delay'?: string;
          'rotation-per-second'?: string;
          'interaction-prompt'?: string;
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          'environment-image'?: string;
          'skybox-image'?: string;
          exposure?: string;
          poster?: string;
          loading?: string;
          'camera-orbit'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'field-of-view'?: string;
          'min-field-of-view'?: string;
          'max-field-of-view'?: string;
          'touch-action'?: string;
          ref?: React.RefObject<HTMLElement>;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

export {};
