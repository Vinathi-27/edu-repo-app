import { useState, useEffect } from "react";
import { subjects } from "./data/subjects";
import "./App.css";

// Convert YouTube URLs to embed format
function getYouTubeEmbedUrl(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
  const match = url.match(regExp);
  return match ? `https://www.youtube.com/embed/${match[2]}` : url;
}

// Map material types to display labels
const materialTypeLabels = {
  pdf: "PDF",
  video: "Video",
  playlist: "Playlist",
  folder: "Folder",
};

function App() {
  // Load dark mode preference from localStorage or system setting
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Apply or remove .dark class from <html>
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const allMaterials = subjects.flatMap((subject) =>
    subject.materials.map((material) => ({
      ...material,
      subjectName: subject.name,
      subjectId: subject.id,
    }))
  );

  const filteredMaterials = allMaterials.filter((material) => {
    const matchesType = filter === "all" || material.type === filter;
    const matchesSearch =
      material.title.toLowerCase().includes(search.toLowerCase()) ||
      material.subjectName.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <>
      <button
        className="theme-toggle"
        onClick={() => setDark((prev) => !prev)}
        aria-label="Toggle dark mode"
      >
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="app-container">
        <h1>BTech CSE Educational Repository</h1>

        <div className="centered-row">
          <input
            type="text"
            placeholder="Search subjects or materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="playlist">Playlist</option>
            <option value="folder">Folder</option>
          </select>
        </div>

        {filteredMaterials.length === 0 ? (
          <div>No materials found.</div>
        ) : (
          <ul className="material-list">
            {filteredMaterials.map((material, idx) => (
              <li key={idx} className="subject-section">
                <div style={{ textAlign: "center", width: "100%" }}>
                  <strong>{material.subjectName}:</strong> {material.title}{" "}
                  <span style={{ color: "#888", fontSize: 14 }}>
                    ({materialTypeLabels[material.type]})
                  </span>
                </div>

                {material.type === "pdf" ? (
                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                    📄 View PDF
                  </a>
                ) : material.type === "folder" ? (
                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                    📁 {material.title}
                  </a>
                ) : material.type === "video" ? (
                  <iframe
                    src={getYouTubeEmbedUrl(material.url)}
                    title={material.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : material.type === "playlist" ? (
                  <iframe
                    src={material.url}
                    title={material.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
