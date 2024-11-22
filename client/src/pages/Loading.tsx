import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
  const [showLongLoadMessage, setShowLongLoadMessage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLongLoadMessage(true);
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timeout); // Clear timeout on unmount
  }, []);
  return (
    <div className="loading-wrapper">
      <p>Loading bindboard</p>
      <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="5"/>
      <div className="long-loading-msg">
        {showLongLoadMessage && <p>Initial load may take some time</p>}
      </div>
    </div>
  );
};

export default Loading;
