import React from 'react';
import './Card.css';
import { Link } from 'react-router-dom';

const Card = (props) => {
  return (
    <div className="Card">
      {/* Edit Button */}
      <Link to={'/edit/' + props.id}>
        <img className="moreButton" alt="edit button" src={more} />
      </Link>

      {/* Clickable Card that links to post details */}
      <Link to={`/post/${props.id}`} className="card-link">
      <div className="card-content">
        <h3>{props.title}</h3>
        <p className="time-posted">{new Date(props.created_at).toLocaleString()}</p>
        <div className="card-upvote">
            <button className="upvoteBtn">⬆️ Upvote</button>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default Card;
