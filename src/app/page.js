"use client";

import { useState } from "react";

export default function Home() {
  const [contestID, setContestID] = useState("");
  const [problemIndex, setProblemIndex] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "pupil",
    "newbie",
    "specialist",
    "expert",
    "candidate master",
    "master",
    "international master",
    "grandmaster",
    "international grandmaster",
    "legendary grandmaster",
  ];

  const languages = [
    "PyPy 3-64",
    "C++17 (GCC 7-32)",
    "Python 3",
    "PyPy 3",
    "C++14 (GCC 6-32)",
    "C++20 (GCC 13-64)",
    "Java 21",
    "JavaScript",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const url = `https://codeforces.com/problemset/status/${contestID}/problem/${problemIndex}`;

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, category, language }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
        console.log(data.data);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-4">Codeforces Submission Scraper</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={contestID}
          onChange={(e) => setContestID(e.target.value)}
          placeholder="Enter Contest ID"
          className="w-[31vw] h-[5vh] px-4 py-2 text-black border rounded-lg mb-4"
          required
        />
        <input
          type="text"
          value={problemIndex}
          onChange={(e) => setProblemIndex(e.target.value)}
          placeholder="Enter Problem Index"
          className="w-[31vw] h-[5vh] py-2 text-black border rounded-lg mb-4"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-[31vw] h-[5vh] px-4 py-2 text-black bg-white border rounded-lg mb-4"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-[31vw] h-[5vh] px-4 py-2 text-black bg-white border rounded-lg mb-4"
          required
        >
          <option value="">Select Language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Scraping..." : "Scrape Submission"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <div className="mt-4 w-full max-w-md bg-black p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <pre className="bg-gray-800 p-2 rounded-lg overflow-x-auto">
            {result.length > 0 ? (
              <div>
                <div className="mb-2">
                  <strong>Author:</strong> {result[0].author}
                </div>
                <div className="mb-2">
                  <a
                    href={`https://codeforces.com/contest/${result[0].contestID}/submission/${result[0].submissionId}`} // Adjust URL as needed
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Submission
                  </a>
                </div>
                <div className="mb-2">
                  <a
                    href={`https://codeforces.com/contest/${result[0].contestID}/submission/${result[0].submissionId}`} // Adjust URL as needed
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Explain the code
                  </a>
                </div>
              </div>
            ) : (
              <p>No results found.</p>
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
