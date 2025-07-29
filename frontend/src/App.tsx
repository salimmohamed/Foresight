import React, { useState } from 'react';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [threshold, setThreshold] = useState(5.0);
  const [numArticles, setNumArticles] = useState(3);
  const [status, setStatus] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('Sending request...');

    try {
      const response = await fetch('http://127.0.0.1:5000/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, companyName, threshold, numArticles }),
      });

      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Foresight Stock Alert</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">Stock Symbol</label>
            <input
              type="text"
              id="symbol"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              id="companyName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">Threshold (%)</label>
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
            <label htmlFor="numArticles" className="block text-sm font-medium text-gray-700">Number of Articles</label>
            <input
              type="number"
              id="numArticles"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={numArticles}
              onChange={(e) => setNumArticles(parseInt(e.target.value))}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Trigger Alert
          </button>
        </form>
        {status && (
          <div className="mt-6 p-3 bg-gray-50 rounded-md text-center text-sm text-gray-800">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;