import React, { useState } from "react";
import styles from "./FetchTitles.module.css";

const FetchTitles: React.FC = () => {
  const [url, setUrl] = useState("");
  const [titles, setTitles] = useState<string[]>([]);

  const fetchTitles = async () => {
    try {
      const response = await fetch(
        `/api/fetch-titles?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      if (response.ok) {
        setTitles(data.titles);
      } else {
        console.error("Error fetching titles:", data.error);
      }
    } catch (error) {
      console.error("Error fetching titles:", error);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={styles.input}
      />
      <button onClick={fetchTitles} className={styles.button}>
        Fetch Titles
      </button>
      {titles.length > 0 && (
        <div className={styles.titles}>
          <h3>Titles:</h3>
          <ul>
            {titles.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FetchTitles;
