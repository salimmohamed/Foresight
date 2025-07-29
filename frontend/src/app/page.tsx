"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [email, setEmail] = useState("");
  const [symbol, setSymbol] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [threshold, setThreshold] = useState(5.0);
  const [numArticles, setNumArticles] = useState(3);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("http://localhost:5000/alert", { // Assuming Flask runs on port 5000
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          companyName,
          threshold,
          numArticles,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsError(false);
      } else {
        setMessage(data.message || "An unknown error occurred.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Failed to connect to the backend. Please ensure the Flask server is running.");
      setIsError(true);
      console.error("Fetch error:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Stock News Alert</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Recipient Email (for alert)
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
              Stock Symbol (e.g., AAPL)
            </label>
            <input
              type="text"
              id="symbol"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="AAPL"
              required
            />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name (e.g., Apple Inc.)
            </label>
            <input
              type="text"
              id="companyName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Apple Inc."
              required
            />
          </div>
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
              Percentage Change Threshold (%)
            </label>
            <input
              type="number"
              id="threshold"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="numArticles" className="block text-sm font-medium text-gray-700">
              Number of Articles
            </label>
            <input
              type="number"
              id="numArticles"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={numArticles}
              onChange={(e) => setNumArticles(parseInt(e.target.value))}
              min="1"
            />
          </div>
          <Button type="submit" className="w-full">
            Get Stock Alert
          </Button>
        </form>
        {message && (
          <div className={`mt-4 p-3 rounded-md text-center ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}
      </Card>
    </main>
  );
}
