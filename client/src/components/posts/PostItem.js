import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
  showActions
}) => {
  return (
    <div className="post bg-white my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img src={avatar} alt="" className="round-img my-1" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          {" "}
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>
        {showActions && (
          <Fragment>
            <button className="btn" onClick={() => addLike(_id)}>
              <i className="fas fa-thumbs-up"></i>{" "}
              {likes && likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button className="btn" onClick={() => removeLike(_id)}>
              <i className="fas fa-thumbs-down"></i>{" "}
            </button>
            <Link to={`/post/${_id}`} className="btn btn-primary">
              Discussion{" "}
              {comments && comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button
                className="btn btn-danger round-img"
                onClick={() => deletePost(_id)}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
