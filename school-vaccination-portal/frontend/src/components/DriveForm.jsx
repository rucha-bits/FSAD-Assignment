import React, { useState } from 'react';
import api from '../services/api';

function DriveForm() {
  const [drive, setDrive] = useState({
    vaccineName: '',
    date: '',
    availableDoses: '',
    applicableClasses: '',
  });

  const handleChange = (e) => {
    setDrive({ ...drive, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/drives', {
        ...drive,
        applicableClasses: drive.applicableClasses.split(',').map((c) => c.trim()),
      });
      alert('Drive scheduled!');
      setDrive({ vaccineName: '', date: '', availableDoses: '', applicableClasses: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Error scheduling drive');
    }
  };

  return (
    <div>
      <h3>Schedule Vaccination Drive</h3>
      <form onSubmit={handleSubmit}>
        <input name="vaccineName" placeholder="Vaccine Name" value={drive.vaccineName} onChange={handleChange} required />
        <input name="date" type="date" value={drive.date} onChange={handleChange} required />
        <input name="availableDoses" type="number" placeholder="Available Doses" value={drive.availableDoses} onChange={handleChange} required />
        <input name="applicableClasses" placeholder="Applicable Classes (e.g. 5,6,7)" value={drive.applicableClasses} onChange={handleChange} required />
        <button type="submit">Create Drive</button>
      </form>
    </div>
  );
}

export default DriveForm;
