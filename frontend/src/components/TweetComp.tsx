import React, { useEffect } from 'react';

interface TwitterEmbedProps {
  tweetUrl: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export function TwitterEmbed({ tweetUrl }: TwitterEmbedProps) {
  useEffect(() => {
    const loadTwitterScript = () => {
      // Check if the script already exists
      if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          if (window.twttr) {
            window.twttr.widgets.load();
          }
        };
      } else if (window.twttr) {
        // If the script is already loaded, reinitialize the widgets
        window.twttr.widgets.load();
      }
    };

    loadTwitterScript();
  }, [tweetUrl]);

  return (
    <div className="twitter-embed  w-full">
      <blockquote className="twitter-tweet " data-dnt="true">
        <a href={tweetUrl}></a>
      </blockquote>
    </div>
  );
}
