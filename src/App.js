import React, { useState, useEffect, useRef } from "react";

const MyComponent = () => {
  const [data, setData] = useState([]); // Your total dataset
  const [visibleData, setVisibleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const observer = useRef(null);
  const sentinelRef = useRef(null);

  const fetchData = async () => {
    setIsLoading(true);

    // Simulating an API call or data fetch
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/comments?page=${page}&limit=10`
    );
    const newData = await response.json();

    setData((prevData) => [...prevData, ...newData]);
    setIsLoading(false);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchData(); // Fetch initial data when the component mounts
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    observer.current = new IntersectionObserver(handleIntersection, options);
    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    setVisibleData(data.slice(0, page * 10));
  }, [data, page]);

  const handleIntersection = (entries) => {
    const target = entries[0];

    if (target.isIntersecting) {
      fetchData();
    }
  };

  return (
    <div>
      {visibleData.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}

      <div ref={sentinelRef} style={{ height: "10px" }} />

      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default MyComponent;
