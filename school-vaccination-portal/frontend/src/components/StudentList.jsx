import React, { useEffect, useState } from 'react';
import api from '../services/api';

function StudentList({ refreshFlag }) {
  const [students, setStudents] = useState([]);
  const [drives, setDrives]     = useState([]);
  const [selectedDrive, setSelectedDrive] = useState({}); // { [studentId]: driveId }

  // Fetch students & upcoming drives when component mounts or refreshFlag toggles
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Students
        const stuRes = await api.get('/api/students');
        setStudents(stuRes.data);

        // 2. Upcoming drives
        let drRes;
        try {
          drRes = await api.get('/api/drives/upcoming');
        } catch {
          drRes = await api.get('/api/drives');
        }
        // Filter next 30 days
        const now = new Date();
        const in30 = new Date(now);
        in30.setDate(now.getDate() + 30);
        const upcoming = drRes.data.filter((d) => {
          const dt = new Date(d.date);
          return dt >= now && dt <= in30;
        });
        setDrives(upcoming);
      } catch (err) {
        console.error('Error loading students/drives:', err);
      }
    }
    loadData();
  }, [refreshFlag]);

  // Handle selection change per student
  const handleDriveSelect = (studentId, driveId) => {
    setSelectedDrive((prev) => ({ ...prev, [studentId]: driveId }));
  };

  // Mark student vaccinated
  const markVaccinated = async (studentId) => {
    const driveId = selectedDrive[studentId];
    if (!driveId) {
      alert('Please select a drive first');
      return;
    }

    try {
      await api.put('/api/students/vaccinate', { studentId, driveId });
      alert('Vaccination recorded');
      // Refresh list
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId
            ? { ...s, vaccinationRecords: [...(s.vaccinationRecords || []), { driveId }] }
            : s
        )
      );
    } catch (err) {
      console.error('Error marking vaccinated:', err);
      alert(err.response?.data?.error || 'Failed to record vaccination');
    }
  };

  return (
    <div>
      <h3>All Students</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Class</th>
            <th>Vaccinated?</th>
            <th>Mark Vaccinated</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const isVaccinated = s.vaccinationRecords?.some(
              (r) => r.driveId
            );
            return (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.studentId}</td>
                <td>{s.class}</td>
                <td>{isVaccinated ? 'Yes' : 'No'}</td>
                <td>
                  {!isVaccinated && drives.length > 0 ? (
                    <>
                      <select
                        value={selectedDrive[s._id] || ''}
                        onChange={(e) => handleDriveSelect(s._id, e.target.value)}
                      >
                        <option value="">Select Drive</option>
                        {drives.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.vaccineName} ({new Date(d.date).toLocaleDateString()})
                          </option>
                        ))}
                      </select>
                      <button
                        style={{ marginLeft: '4px' }}
                        onClick={() => markVaccinated(s._id)}
                      >
                        Mark Vaccinated
                      </button>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
