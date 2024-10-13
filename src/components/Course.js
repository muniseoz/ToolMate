import React, { useEffect, useState } from 'react';
import './Course.css';
import SoftwareTool from './SoftwareTool';

export default function Course(props) {
    const { name, desc } = props;

    // Initializes a state for an array of softwareTools (formatted as objects)
    const [softwareTools, setSoftwareTools] = useState([]);

    // Dummy data for the software tools
    const getSoftwareTools = async (name) => {
        const softwareToolsArray = [
            {
                id: "exampleID",
                name: "IntelliJ",
                upvotes: 5,
                desc: "IntelliJ is a Java IDE"
            },
            {
                id: "exampleID2",
                name: "Eclipse",
                upvotes: -2,
                desc: "Eclipse is a Java IDE"
            }
        ];

        setSoftwareTools(softwareToolsArray);
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
        getSoftwareTools(name);
    }, [name]);

    // Reformats softwareTools into an array of SoftwareTool components
    const softwareToolComponentArray = softwareTools.map((softwareTool) => (
        <div key={softwareTool.id}>
            <SoftwareTool
                name={softwareTool.name}
                id={softwareTool.id}
                upvotes={softwareTool.upvotes}
                desc={softwareTool.desc}
                onUpdateUpvotes={updateUpvotes} // Passing the updateUpvotes function
            />
        </div>
    ));

    return (
        <div>
            <h1>{name}</h1>
            <p>{desc}</p>
            <div>
                <h2>Software Tools:</h2>
                <div>
                    {softwareToolComponentArray}
                </div>
            </div>
        </div>
    );
}
