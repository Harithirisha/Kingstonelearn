import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import ProfessorsDashboard from './pages/ProfessorsDashboard';
import StudentsDashboard from './pages/StudentsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentSignup from './pages/StudentsSignup';
import ProfessorSignup from './pages/ProfessorsSignup';
import StudentManagement from './pages/StudentManagement';
import ProfessorManagement from './pages/ProfessorManagement';
import Home from './pages/Home';
import CourseManagement from './pages/CourseManagement';
import CourseCreation from './pages/CourseCreation'; // Import CourseCreation component
import LessonCreation from './pages/LessonManagement';
import CourseApproval from './pages/CourseApproval';
import BatchCreation from './pages/BatchManagement';
import EnrollmentPage from './pages/EnrollmentPage';
import EnrollmentTable from './pages/Mycourses';
import EnrollmentList from './pages/PaymentApproval';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/student-signup' element={<StudentSignup />} />
          <Route exact path='/professor-signup' element={<ProfessorSignup />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/professor-dashboard' element={<ProfessorsDashboard />} />
          <Route exact path='/student-dashboard' element={<StudentsDashboard />} />
          <Route exact path='/admin-dashboard' element={<AdminDashboard />} />
          <Route exact path='/student-management' element={<StudentManagement />} />
          <Route exact path='/professor-management' element={<ProfessorManagement />} />
          <Route exact path='/course-management' element={<CourseManagement />} />
          <Route exact path='/professor/create-course' element={<CourseCreation />} />
          <Route exact path='/professor/manage-lessons' element={<LessonCreation/>}/>
          <Route exact path='/course-approvals' element={<CourseApproval/>}/>
          <Route exact path='/professor/manage-batches' element={<BatchCreation/>}/>
          <Route exact path='/students/enrollment-page' element={<EnrollmentPage />} />
          <Route exact path='/students/my-courses' element={<EnrollmentTable />} />
          <Route exact path='/payment-approvals' element={<EnrollmentList/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
