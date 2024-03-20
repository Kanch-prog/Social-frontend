import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [commentInput, setCommentInput] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const storedUsername = localStorage.getItem('username');
            setUsername(storedUsername);
            axios
                .get("http://localhost:5000/api/posts", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => setPosts(response.data))
                .catch((error) => console.error("Error fetching posts:", error));
        }
    }, []);

    const handleLike = (postId) => {
        const token = localStorage.getItem('token');
    
        axios
            .post(`http://localhost:5000/api/posts/like/${postId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const updatedPosts = posts.map((post) =>
                    post._id === postId ? response.data : post
                );
                setPosts(updatedPosts);
            })
            .catch((error) => console.error("Error liking post:", error));
    };
    
    const handleAddComment = (postId, commentText) => {
        const token = localStorage.getItem('token');
        
        axios
            .post(
                `http://localhost:5000/api/posts/comment/${postId}`,
                { text: commentText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                const updatedPosts = posts.map((post) =>
                    post._id === postId ? response.data : post
                );
                setPosts(updatedPosts);
                setCommentInput(''); 
            })
            .catch((error) => console.error("Error adding comment:", error));
    };
   

    return (
        <div className="home">
            {isLoggedIn ? (
                <>
                    <h2>Recent Posts</h2>
                    {posts.map((post) => (
                        <div key={post._id} className="post">
                            <h3>{post.title}</h3>
                            <p>Posted by: {post.user.username}</p>
                            <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
                            <p>{post.content}</p>
                            {post.file && (
                                <div>
                                    {post.file.includes(".mp4") ? (
                                        <video width="320" height="240" controls>
                                            <source
                                                src={
                                                    `http://localhost:5000/uploads/${post.file}`
                                                }
                                                type="video/mp4"
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img
                                            src={
                                                `http://localhost:5000/uploads/${post.file}`
                                            }
                                            alt="Post Media"
                                        />
                                    )}
                                </div>
                            )}
                            <p>Likes: {post.likes}</p>
                            <button onClick={() => handleLike(post._id)}>Like</button>
                            <p>Comments: {post.comments.length}</p>
                            <ul>
                            {post.comments.map((comment, index) => {
                                console.log(comment); // Log the comment object
                                console.log(comment.user); // Log the user object within the comment
                                return (
                                    <li key={index}>{comment.text} - {comment.user.username}</li>
                                );
                            })}
                            </ul>

                            <input
                                type="text"
                                placeholder="Add a comment"
                                className="comment-input"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            />
                            <button
                                onClick={() => handleAddComment(post._id, commentInput)}
                                className="comment-button"
                            >
                                Add Comment
                            </button>
                        </div>
                    ))}
                </>
            ) : (
                <p>Please log in to see posts.</p>
            )}
        </div>
    );
}

export default Home;
