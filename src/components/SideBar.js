import React, { useEffect, useState } from 'react';
import './SideBar.css';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Sidebar({ onSelectCourse }) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesSnapshot = await getDocs(collection(db, 'courses'));
                const coursesArray = coursesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Fetched courses:", coursesArray); // Verify if data is fetched
                setCourses(coursesArray);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="sidebar">
            <h2>Courses</h2>
            <ul>
                {courses.map((course) => (
                    <li key={course.id} onClick={() => onSelectCourse(course)}>
                        {course.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
