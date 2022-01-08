import { useCallback, useEffect, useRef, useState } from "react";

const useInfiniteScroll = (targetEl) => {
  const oberverRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  const getObserver = useCallback(() => {
    if (!oberverRef.current) {
      oberverRef.current = new IntersectionObserver((entries) =>
        setIntersecting(entries.some((entry) => entry.isIntersecting))
      );
    }

    return oberverRef.current;
  }, [oberverRef.current]);

  useEffect(() => {
    if (targetEl.current) getObserver().observe(targetEl.current);

    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
