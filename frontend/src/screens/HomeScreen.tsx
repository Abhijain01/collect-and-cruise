import { useEffect } from "react";

const HomeScreen = () => {
  useEffect(() => {
    document.title = "Collect & Cruise | Home";
  }, []);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Welcome to Collect & Cruise 🚗</h1>
      <p>Browse, collect, and showcase your favorite items.</p>
    </div>
  );
};

export default HomeScreen;
