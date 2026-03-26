import React, { useState } from "react";
import api from "../../../api/api";

const InsertProblem = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const parsed = JSON.parse(jsonInput);

      const res = await api.post("/api/problems/insert", parsed);

      setMessage("✅ Problem inserted successfully");
      console.log(res.data);
      setJsonInput("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid JSON or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
      <h2 className="text-white text-xl mb-4">Insert Problem</h2>

      <textarea
        className="w-full h-60 bg-black text-white p-3 border border-gray-700 rounded"
        placeholder="Paste problem JSON here..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Problem"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-gray-300">{message}</p>
      )}
    </div>
  );
};

export default InsertProblem;