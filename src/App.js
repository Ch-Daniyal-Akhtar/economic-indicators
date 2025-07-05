import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_KEY = "b87f3df893414e9:b9eeldi6a7ixvcl";

function App() {
  const countries = ["Mexico", "New Zealand", "Sweden", "Thailand"];
  const categories = [
    "GDP",
    "Inflation Rate",
    "Unemployment Rate",
    "Interest Rate",
    "Balance of Trade",
  ];

  const [selectedCountry, setSelectedCountry] = useState("Mexico");
  const [selectedCategory, setSelectedCategory] = useState("GDP");
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);
  const [GDP, setGDP] = useState(2.1);
  const [Inflation, setInflation] = useState(4.42);
  const [unemployement, setUnemployment] = useState(2.7);

  // Fetch country data
  useEffect(() => {
    const fetchCountryData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.tradingeconomics.com/country/${selectedCountry}?c=${API_KEY}&f=json`
        );
        const data = await response.json();
        setCountryData(data);

        const gdpData = data.find((item) => item.Category === "GDP");
        if (gdpData) {
          setGDP(gdpData.LatestValue);
        }
        const inflation = data.find(
          (item) => item.Category === "Inflation Rate"
        );
        if (inflation) {
          setInflation(inflation.LatestValue);
        }
        const unemployement = data.find(
          (item) => item.Category === "Unemployment Rate"
        );
        if (unemployement) {
          setUnemployment(unemployement.LatestValue);
        }

        // Get historical data for the selected category
        if (selectedCategory) {
          const historicalResponse = await fetch(
            `https://api.tradingeconomics.com/historical/country/${selectedCountry}/indicator/${encodeURIComponent(
              selectedCategory
            )}?c=${API_KEY}&f=json`
          );
          const historical = await historicalResponse.json();
          setHistoricalData(historical);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchCountryData();
  }, [selectedCountry, selectedCategory]);

  // Render economic indicators table
  const renderIndicatorsTable = () => {
    if (loading) return <div className="text-center py-8">Loading data...</div>;

    return (
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full bg-white rounded-none sm:rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm font-medium">
                  Indicator
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm font-medium">
                  Latest Value
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm font-medium">
                  Previous Value
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm font-medium">
                  Unit
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm font-medium">
                  Frequency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {countryData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-medium text-xs sm:text-sm">
                    {item.Category}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    {item.LatestValue}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    {item.PreviousValue}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    {item.Unit}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    {item.Frequency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render historical chart
  const renderHistoricalChart = () => {
    if (loading || historicalData.length === 0) return null;

    // Prepare data for the chart
    const chartData = historicalData
      .map((item) => ({
        date: item.DateTime.split("T")[0],
        value: item.Value,
      }))
      .slice(0, 10);

    return (
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-800">
          Historical Data: {selectedCategory} in {selectedCountry}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              name={selectedCategory}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 sm:py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Global Economic Indicators Dashboard
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base">
            Compiled Data from Trading Economics
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Country and Category Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Economic Indicator
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-blue-800">
              Current Data for {selectedCountry}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-700">GDP</p>
                <p className="text-lg sm:text-xl font-bold">${GDP} Billion</p>
              </div>
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-green-700">Inflation</p>
                <p className="text-lg sm:text-xl font-bold">{Inflation}%</p>
              </div>
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg sm:col-span-2 lg:col-span-1">
                <p className="text-xs sm:text-sm text-purple-700">
                  Unemployment
                </p>
                <p className="text-lg sm:text-xl font-bold">{unemployement}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data Chart */}
        <div className="mb-6 sm:mb-8">{renderHistoricalChart()}</div>

        {/* Detailed Indicators Table */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-blue-800">
            Detailed Economic Indicators for {selectedCountry}
          </h2>
          {renderIndicatorsTable()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 sm:py-6 mt-8 sm:mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">
            Global Economic Indicators Dashboard &copy;{" "}
            {new Date().getFullYear()}
          </p>

          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Designed By Ch Daniyal, visit{" "}
            <a
              href="https://www.daniyaldev.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              www.daniyaldev.me
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
