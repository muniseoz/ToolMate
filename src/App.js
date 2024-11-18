// App.js
import React, { useState, useEffect } from 'react';
import Sidebar from './components/SideBar';
import Course from './components/Course';
import './App.css';
import { db } from './config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function App() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        // Fetch courses from Firebase and set them in state
        const fetchCourses = async () => {
            const coursesCollection = collection(db, "courses");
            const courseSnapshot = await getDocs(coursesCollection);
            const courseList = courseSnapshot.docs.map((doc) => ({
                id: doc.id, // Get document ID
                ...doc.data(), // Get document data
            }));
            setCourses(courseList);
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
                    <Course 
                        id={selectedCourse.id} // Pass the document ID as `id`
                        name={selectedCourse.name}
                        desc={selectedCourse.desc}
                    />
                ) : (
                    <h2 className='select-prompt'>Select a course to view details</h2>
                )}
            </div>
        </div>
    );
}
