import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    vaccinated: 0,
    percentage: 0,
    upcomingDrives: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // 1. Fetch all students
        const { data: students } = await api.get('/api/students');
        const vaccinatedCount = students.filter(
          (s) => s.vaccinationRecords && s.vaccinationRecords.length > 0
        ).length;

        // 2. Fetch drives (try upcoming, otherwise fallback)
        let resp;
        try {
          resp = await api.get('/api/drives/upcoming');
        } catch {
          resp = await api.get('/api/drives');
        }
        const drives = resp.data;

        // 3. Filter drives in the next 30 days
        const now = new Date();
        const in30 = new Date(now);
        in30.setDate(now.getDate() + 30);
        const upcoming = drives.filter((d) => {
          const dt = new Date(d.date);
          return dt >= now && dt <= in30;
        });

        // 4. Compute percentage
        const total = students.length;
        const percent = total ? ((vaccinatedCount / total) * 100).toFixed(2) : 0;

        setMetrics({
          totalStudents: total,
          vaccinated: vaccinatedCount,
          percentage: percent,
          upcomingDrives: upcoming,
        });
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) return <p>Loading dashboard…</p>;

  return (
    <div
      style={{
        padding: '1rem',
        background: '#fff',
        borderRadius: '4px',
        boxShadow: '0 0 8px rgba(0,0,0,0.1)',
        marginBottom: '1rem',
      }}
    >
      <h2>Dashboard Overview</h2>
      <p><strong>Total Students:</strong> {metrics.totalStudents}</p>
      <p><strong>Vaccinated:</strong> {metrics.vaccinated}</p>
      <p><strong>Percentage Vaccinated:</strong> {metrics.percentage}%</p>
      <h4>Upcoming Drives (next 30 days):</h4>
      {metrics.upcomingDrives.length === 0 ? (
        <p>No upcoming drives</p>
      ) : (
        <ul>
          {metrics.upcomingDrives.map((d) => (
            <li key={d._id}>
              {d.vaccineName} — {new Date(d.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
