import React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function Ranking({ id, name, upvotes, onUpdateUpvotes }) {
    return (
        <div className='body'>
            <button
                className='increment-button'
                onClick={() => onUpdateUpvotes(id, 1)}
            >
                <ArrowUpwardIcon />
            </button>
            <button
                className='increment-button'
                onClick={() => onUpdateUpvotes(id, -1)}
            >
                <ArrowDownwardIcon />
            </button>
        </div>
    );
}
