import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DriveList() {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    async function fetchDrives() {
      try {
        const res = await api.get('/api/drives');
        setDrives(res.data);
      } catch (err) {
        console.error('Error fetching drives:', err);
      }
    }
    fetchDrives();
  }, []);

  return (
    <div>
      <h3>Vaccination Drives</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Vaccine</th>
            <th>Date</th>
            <th>Doses</th>
            <th>Classes</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {drives.map((d) => (
            <tr key={d._id}>
              <td>{d.vaccineName}</td>
              <td>{new Date(d.date).toLocaleDateString()}</td>
              <td>{d.availableDoses}</td>
              <td>{d.applicableClasses.join(', ')}</td>
              <td>{new Date(d.date) < new Date() ? 'Completed' : 'Upcoming'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DriveList;
