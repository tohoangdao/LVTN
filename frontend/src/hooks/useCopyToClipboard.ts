import { useState, useCallback } from "react";

function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((error) => {
          console.error("Failed to copy text to clipboard:", error);
          setIsCopied(false);
        });
    } else {
      console.error("Clipboard API is not available");
      setIsCopied(false);
    }
  }, []);

  return { isCopied, copyToClipboard };
}

export default useCopyToClipboard;
