import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Report() {
  const [rows, setRows] = useState([]);
  const [vaccineFilter, setVaccineFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const loadReport = async (p = 1) => {
    try {
      const res = await api.get('/api/reports', {
        params: { vaccineName: vaccineFilter, page: p, limit: 10 },
      });
      setRows(res.data.data);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error('Error loading report:', err);
    }
  };

  useEffect(() => {
    loadReport(1);
  }, [vaccineFilter]);

  const downloadCSV = () => {
    const header = ['Name', 'Student ID', 'Class', 'Vaccine', 'Date'];
    const csv = [
      header.join(','),
      ...rows.map((r) =>
        [r.name, r.studentId, r.class, r.vaccineName, new Date(r.date).toLocaleDateString()].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'vaccination_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Vaccination Report</h3>

      <div>
        <input
          placeholder="Filter by vaccine name"
          value={vaccineFilter}
          onChange={(e) => setVaccineFilter(e.target.value)}
        />
        <button onClick={() => loadReport(1)}>Search</button>
        <button onClick={downloadCSV} style={{ marginLeft: '1rem' }}>
          Download CSV
        </button>
      </div>

      <table border="1" cellPadding="6" style={{ marginTop: '1rem', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Class</th>
            <th>Vaccine</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td>{r.name}</td>
              <td>{r.studentId}</td>
              <td>{r.class}</td>
              <td>{r.vaccineName}</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '0.5rem' }}>
        Page {page} of {pages}{' '}
        {page > 1 && <button onClick={() => loadReport(page - 1)}>Prev</button>}{' '}
        {page < pages && <button onClick={() => loadReport(page + 1)}>Next</button>}
      </div>
    </div>
  );
}
