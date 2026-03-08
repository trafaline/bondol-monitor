import React, { useState, useEffect } from 'react';

const LogDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Filter
  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    category: '',
    level: '',
    date: ''
  });

  const [pagination, setPagination] = useState({
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: filters.limit,
        page: filters.page,
        ...(filters.category && { category: filters.category }),
        ...(filters.level && { level: filters.level }),
      });

      if (filters.date) {
        queryParams.append('date', filters.date);
      }

      const response = await fetch(`https://bondol-api.trafaline.com/log?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': "12345678910"
        }
      });
      const result = await response.json();

      if (result.status === 'success') {
        setLogs(result.data);
        setPagination({
          totalPages: result.meta.total_pages,
          hasNext: result.meta.has_next,
          hasPrev: result.meta.has_prev
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const getLevelBadge = (level) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-bold ";
    return level === 'ERROR'
      ? baseClass + "bg-red-100 text-red-600"
      : baseClass + "bg-green-100 text-green-600";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bondol Activity Monitor</h1>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="border rounded-md px-3 py-2 bg-white"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            >
              <option value="">ALL KATEGORI</option>
              <option value="CHAT">CHAT</option>
              <option value="IMAGE">IMAGE</option>
              <option value="RECOMENDED">RECOMENDED</option>
              <option value="VOICE">VOICE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              className="border rounded-md px-3 py-2 bg-white"
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value, page: 1 })}
            >
              <option value="">ALL LEVEL</option>
              <option value="INFO">INFO</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
            <input
              type="number"
              className="border rounded-md px-3 py-2 w-20"
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: e.target.value, page: 1 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="border rounded-md px-3 py-2 bg-white"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value, page: 1 })}
            />
            {filters.date && (
              <button
                onClick={() => setFilters({ ...filters, date: '' })}
                className="ml-2 px-3 py-2 bg-red-500 text-white text-xs font-semibold rounded-md hover:bg-red-600 transition-colors shadow-sm"
              >
                Clear Date
              </button>
            )}
          </div>

          <button
            onClick={fetchLogs}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm uppercase">
                  <th className="px-4 py-3 font-semibold w-12 text-center">No.</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Level</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Provider/Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    {/* Jangan lupa colSpan ditambah 1 karena sekarang ada kolom nomor (total 6) */}
                    <td colSpan="6" className="text-center py-10 text-gray-500">Loading data...</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">No logs found.</td>
                  </tr>
                ) : (
                  logs.map((log, index) => {
                    // Deklarasi variabel harus di dalam kurung kurawal sebelum return
                    const rowNumber = (filters.page - 1) * filters.limit + (index + 1);

                    return (
                      <tr key={log._id} className="hover:bg-gray-50 transition text-sm">
                        {/* 1. Kolom Nomor */}
                        <td className="px-4 py-3 text-gray-500 text-center font-medium">
                          {rowNumber}
                        </td>

                        {/* 2. Kolom Timestamp */}
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>

                        {/* 3. Kolom Category */}
                        <td className="px-4 py-3">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {log.category}
                          </span>
                        </td>

                        {/* 4. Kolom Level */}
                        <td className="px-4 py-3">
                          <span className={getLevelBadge(log.level)}>{log.level}</span>
                        </td>

                        {/* 5. Kolom Message */}
                        <td className="px-4 py-3 text-gray-700 max-w-md truncate" title={log.message}>
                          {log.message}
                        </td>

                        {/* 6. Kolom Metadata */}
                        <td className="px-4 py-3 text-gray-600 italic">
                          {log.metadata?.provider || log.metadata?.service || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Halaman <span className="font-medium">{filters.page}</span> dari <span className="font-medium">{pagination.totalPages}</span>
          </div>

          <div className="flex gap-2">
            {/* Tombol Previous */}
            <button
              disabled={!pagination.hasPrev}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className={`px-4 py-2 border rounded-md text-sm font-medium ${!pagination.hasPrev ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Previous
            </button>

            {/* Tombol Next */}
            <button
              disabled={!pagination.hasNext}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className={`px-4 py-2 border rounded-md text-sm font-medium ${!pagination.hasNext ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDashboard;