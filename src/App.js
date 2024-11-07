// App.js
import React, { useState, useEffect } from 'react';
import Sidebar from './components/SideBar';
import Course from './components/Course';
import './App.css';

export default function App() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        // Fetch courses from Firebase and set them in state
        // Example: Assume `fetchCourses` gets courses data from Firebase
        const fetchCourses = async () => {
            // Your Firebase fetching logic here
            // setCourses(fetchedCourses);
        };
        fetchCourses();
    }, []);

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
    };

    return (
        <div className="app-container">
            <Sidebar courses={courses} onSelectCourse={handleSelectCourse} />
            <div className="main-content">
                {selectedCourse ? (
                    <Course name={selectedCourse.name} desc={selectedCourse.desc} />
                ) : (
                    <h2>Select a course to view details</h2>
                )}
            </div>
        </div>
    );
}
