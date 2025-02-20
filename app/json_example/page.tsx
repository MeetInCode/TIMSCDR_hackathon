"use client"
import { useState } from "react";

export default function QueryForm() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://127.0.0.1:5328/api/request_to_python_file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-slate-950">Enter Query</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Submit
                </button>
            </form>
            {response && (
                <div className="mt-4 p-4 bg-gray-800 text-white rounded-md">
                    <h3 className="text-xl font-semibold mb-2">Response:</h3>
                    <pre className="whitespace-pre-wrap break-words">
                        {JSON.stringify(response, null, 4)}
                    </pre>
                </div>
            )}
        </div>
    );
}
