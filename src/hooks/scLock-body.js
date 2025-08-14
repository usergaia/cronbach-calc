// hooks/useBodyScrollLock.js
import { useEffect } from "react";

export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      const originalOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLocked]);
}
