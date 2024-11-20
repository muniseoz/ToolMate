import React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function Ranking({ id, name, upvotes, onUpdateUpvotes, path }) {
    return (
        <div className='body'>
            <button
                className='increment-button'
                onClick={() => onUpdateUpvotes(path, 1)}
            >
                <ArrowUpwardIcon />
            </button>
            <button
                className='increment-button'
                onClick={() => onUpdateUpvotes(path, -1)}
            >
                <ArrowDownwardIcon />
            </button>
        </div>
    );
}
