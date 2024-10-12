import { useEffect, useState } from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
export default function Ranking(){
    const [count, setCount] = useState(0)
    return(
        <div className='body'>
            <h1>Ranking</h1>
            <h2>CSXX</h2>
            <h3>IntelliJ</h3>
            <h3>Rank {count}</h3>
            <button className='increment-button' onClick={() => setCount(count+1)}><ArrowUpwardIcon/></button>
            <button className='increment-button'onClick={() => setCount(count-1)}><ArrowDownwardIcon/></button>
        </div>
    );
}