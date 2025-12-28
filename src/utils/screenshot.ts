export const captureScreenshot = async (): Promise<string | null> => {
  try {
    // Request screen capture
    const stream = await (navigator.mediaDevices as any).getDisplayMedia({
      video: { mediaSource: 'screen' },
    });

    // Create video element to capture frame
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    // Wait for video to load
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });

    // Create canvas and capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0);
    }

    // Stop all tracks
    stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());

    // Convert to base64
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return null;
  }
};

// Simpler alternative: Capture current visible page (works without permission)
export const capturePageScreenshot = async (): Promise<string | null> => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(document.body, {
      allowTaint: true,
      useCORS: true,
      scale: 0.5, // Reduce size
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Page screenshot failed:', error);
    return null;
  }
};
