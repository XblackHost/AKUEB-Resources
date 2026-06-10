import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export function AdBlockerCheck() {
  const [detected, setDetected] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check after a short delay to let blockers do their work
    const timer = setTimeout(() => {
      if (adRef.current) {
        const height = adRef.current.offsetHeight;
        const width = adRef.current.offsetWidth;
        const display = window.getComputedStyle(adRef.current).display;
        
        if (height === 0 || width === 0 || display === "none") {
          setDetected(true);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div 
        ref={adRef} 
        id="ad-detect" 
        className="ad-banner ads advertisement" 
        style={{ width: "1px", height: "1px", position: "absolute", left: "-9999px" }} 
        aria-hidden="true" 
      />

      <Dialog open={detected} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideClose>
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl">Ad Blocker Detected</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              AKUEB Resources is a free, non-profit resource built by students. We rely on minimal ads to keep the servers running and our library available to everyone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-6">
            <Button size="lg" onClick={() => window.location.reload()}>
              I've disabled my ad blocker — Continue
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Please pause your ad blocker for this site and refresh the page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
