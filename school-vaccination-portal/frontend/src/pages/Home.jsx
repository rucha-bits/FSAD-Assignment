import React from 'react';
import Dashboard from '../components/Dashboard';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import DriveForm from '../components/DriveForm';
import DriveList from '../components/DriveList';
import Report from '../components/Report';

function Home({ onLogout }) {
return (
<div>
<header>
<h1>Welcome, School Coordinator</h1>
<button onClick={onLogout}>Logout</button>
</header>
<Dashboard />
<StudentForm />
<StudentList />
<DriveForm />
<DriveList />
<Report />
</div>
);
}

export default Home;