import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useInfiniteScroll = (loadMore, hasMore = true) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  return ref;
};
