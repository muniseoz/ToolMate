import React, { useEffect, useState } from 'react';
import './Course.css';
import SoftwareTool from './SoftwareTool';

import { db } from '../config/firebase';
import { collection, getDocs, getDoc, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';

export default function Course(props) {
    const { name, desc } = props;

    // Initializes a state for an array of softwareTools (formatted as objects)
    const [softwareTools, setSoftwareTools] = useState([]);

    // Fetches the list of software tools from Firebase and sets `softwareTools` state
    const getSoftwareTools = async () => {
        try {
            // Clear previous tools when a new course is selected
            setSoftwareTools([]);

            // Get the course document that matches the `name` prop
            const thisCourseSnapshot = await getDocs(query(collection(db, "courses"), where("name", "==", name)));
            const thisCourseID = thisCourseSnapshot.docs.length > 0 ? thisCourseSnapshot.docs[0].id : 0;

            // Get software tools from the subcollection of the selected course
            const softwareToolsSnapshot = await getDocs(query(collection(db, "courses", thisCourseID, "softwareTools"), orderBy("upvotes", "desc")));

            // Map the documents to an array format
            const filteredSoftwareToolsArray = softwareToolsSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                path: doc.ref.path
            }));

            setSoftwareTools(filteredSoftwareToolsArray);
        } catch (err) {
            console.error("Error fetching software tools:", err);
        }
    };

    // Update upvotes for a specific software tool
    const updateUpvotes = async (path, change) => {
        const softwareToolRef = doc(db, path);
        const softwareToolUpvotes = (await getDoc(softwareToolRef)).data().upvotes;
        await updateDoc(softwareToolRef, { upvotes: softwareToolUpvotes + change });

        getSoftwareTools();
    };

    // Runs whenever the component is loaded or the `name` prop changes
    useEffect(() => {
        getSoftwareTools();
    }, [name]); // <--- Added `name` as a dependency

    // Reformats softwareTools into an array of SoftwareTool components
    const softwareToolComponentArray = softwareTools.map((softwareTool) => (
        <div key={softwareTool.id} className='software-tool-element'>
            <SoftwareTool
                name={softwareTool.name}
                id={softwareTool.id}
                upvotes={softwareTool.upvotes}
                desc={softwareTool.desc}
                onUpdateUpvotes={updateUpvotes}
                path={softwareTool.path}
            />
        </div>
    ));

    return (
        <div className='software-tools'>
            <h1>{name}</h1>
            <p>{desc}</p>
            <div>
                <h2>Software Tools:</h2>
                <div className='software-tools-array'>
                    {softwareToolComponentArray}
                </div>
            </div>
        </div>
    );
}
