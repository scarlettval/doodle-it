import React from 'react';
import './Card.css';
import { Link } from 'react-router-dom';
import more from './more.png';

const Card = (props) => {
  return (
    <div className="Card">
      {/* Edit Button */}
      <Link to={'/edit/' + props.id}>
        <img className="moreButton" alt="edit button" src={more} />
      </Link>

      {/* Clickable Card that links to post details */}
      <div className="card-content">
        <Link to={`/post/${props.id}`} className="card-link">
          <h3>{props.title}</h3>
          <p className="time-posted">{new Date(props.created_at).toLocaleString()}</p>
        </Link>

        {/* Upvote section */}
        <div className="card-upvote">
          <p>{props.upvotes} Upvotes</p>
          <button onClick={props.onUpvote} className="upvoteBtn">⬆️ Upvote</button>
        </div>
      </div>
    </div>
  );
};

export default Card;

