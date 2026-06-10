import { useEffect, useRef } from "react";

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (!containerRef.current || injected.current) return;
    injected.current = true;

    // Set atOptions
    const optScript = document.createElement("script");
    optScript.text = `
      atOptions = {
        'key' : '5187eefa6504fec06240cc22c5c101b2',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    containerRef.current.appendChild(optScript);

    // Load invoke script
    const invokeScript = document.createElement("script");
    invokeScript.src = "https://www.highperformanceformat.com/5187eefa6504fec06240cc22c5c101b2/invoke.js";
    invokeScript.async = true;
    containerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div className="flex justify-center py-8 px-4">
      <div
        ref={containerRef}
        style={{ width: 728, height: 90 }}
        className="max-w-full overflow-hidden"
      />
    </div>
  );
}
