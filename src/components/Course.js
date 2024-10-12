// Expects props: name, desc
import { useEffect, useState } from 'react'
import './Course.css'
import SoftwareTool from './SoftwareTool'

export default function Course(props) {
    const {name, desc} = props

    // CURRENTLY: I am using dummy data, but treating it like it is being called from the database
    // Do not be alarmbed by all of the strange looking functions just to return a hardcoded array

    // Initiallizes a state for an array of softwareTools (formatted as objects)
    const [softwareTools, setSoftwareTools] = useState([])

    // function to get the software tools given the course name
    // in firebase langauge: 
    //      get document in courses collection with name name
    //      get the documents inside the softwareTools subcollection of found document IN RATING ORDER
    const getSoftwareTools = async(name) => {
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
        ]

        setSoftwareTools(softwareToolsArray)
    } 

    // Runs every time page is reloaded, updates softwareTools
    useEffect(() => {
        getSoftwareTools(name)
    }, [])

    // Reformats softwareTools into an array of SoftwareTool components
   const softwareToolComponentArray = softwareTools.map((softwareTool) => (
        <SoftwareTool key={softwareTool.id} name={softwareTool.name} id={softwareTool.id} upvotes={softwareTool.upvotes} desc={softwareTool.desc} />
    ))

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
  )
}


