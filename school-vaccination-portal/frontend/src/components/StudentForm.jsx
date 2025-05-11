import React, { useState } from 'react';
import api from '../services/api';

function StudentForm() {
const [student, setStudent] = useState({
name: '',
studentId: '',
class: '',
});

const handleChange = (e) => {
setStudent({ ...student, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
await api.post('/api/students', student);
alert('Student added!');
setStudent({ name: '', studentId: '', class: '' });
} catch (err) {
console.error('Error adding student:', err);
}
};

return (
<div>
<h3>Add Student</h3>
<form onSubmit={handleSubmit}>
<input name="name" placeholder="Name" value={student.name} onChange={handleChange} required />
<input name="studentId" placeholder="Student ID" value={student.studentId} onChange={handleChange} required />
<input name="class" placeholder="Class" value={student.class} onChange={handleChange} required />
<button type="submit">Add</button>
</form>
</div>
);
}

export default StudentForm;