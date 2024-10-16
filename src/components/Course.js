import React, { useEffect, useState } from 'react';
import './Course.css';
import SoftwareTool from './SoftwareTool';

import { db } from '../config/firebase';
import { collection, getDocs, getDoc, query, where } from 'firebase/firestore';

export default function Course(props) {
    const { name, desc } = props;

    // Initializes a state for an array of softwareTools (formatted as objects)
    const [softwareTools, setSoftwareTools] = useState([]);
    //const [courseDocID, setCourseDocID] = useState(0);

    // Gets list of software tools from Firebase and sets softwareTools to an array of objects with the fields from firebase
    const getSoftwareTools = async () => {
        try {
            // Gets the the course that matches the name passed as prop and keeps the id
            const thisCourseSnapshot = await getDocs(query(collection(db, "courses"), where("name", "==", name)));
            const thisCourseID = thisCourseSnapshot.docs.length > 0 ? thisCourseSnapshot.docs[0].id : 0;
           
            // Gets the softwareTool docs from the subcollection of the current course document
            const softwareToolsSnapshot = await getDocs(collection(db, "courses", thisCourseID, "softwareTools"));

            // Maps out the data into the array format we desire
            // Path is passed as a prop to aid later components in data retreival
            const filteredSoftwareToolsArray = softwareToolsSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                path: doc.ref.path
            }));

            setSoftwareTools(filteredSoftwareToolsArray);
        } catch (err) {
            console.error(err);
        }
    };

    // Update upvotes for a specific software tool
    const updateUpvotes = (id, change) => {
        setSoftwareTools((prevTools) =>
            prevTools.map((tool) =>
                tool.id === id
                    ? { ...tool, upvotes: tool.upvotes + change }
                    : tool
            )
        );
    };

    // Runs when the component is loaded
    useEffect(() => {
        getSoftwareTools();
    }, []);

    // Reformats softwareTools into an array of SoftwareTool components
    const softwareToolComponentArray = softwareTools.map((softwareTool) => (
        <div key={softwareTool.id} className='software-tool-element'>
            <SoftwareTool
                name={softwareTool.name}
                id={softwareTool.id}
                upvotes={softwareTool.upvotes}
                desc={softwareTool.desc}
                onUpdateUpvotes={updateUpvotes} // Passing the updateUpvotes function
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
