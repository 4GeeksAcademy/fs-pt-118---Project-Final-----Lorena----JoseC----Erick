import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import servicesGetEvents from "../Services/servicesGetEvents";

const EventComments = ({ eventId }) => {

    const { store, dispatch } = useGlobalReducer()
    const token = localStorage.getItem("token")
    const isAuth = !!store?.isAuth
    const userId = Number(store?.user?.id)
    const [newComment, setNewComment] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [editingText, setEditingText] = useState("")

    // Obtener los comentarios del evento
    useEffect(() => {
    const loadComments = async () => {
        try {
            const data = await servicesGetEvents.getComments(eventId, token);
            dispatch({
                type: "setEventComments",
                payload: { eventId, comments: data.data || [] },
            });
        } catch (error) {
            console.error("Error loading comments:", error);
        }
    };
    loadComments();
}, [eventId, token, dispatch]);

    // Agregar un nuevo comentario
    const handleAddComment = async () => {
        if (!newComment.trim()) return
        if (!isAuth) return
        try {
            const userName = store?.user?.name || "Anonymous";
            const added = await servicesGetEvents.addComment(eventId, newComment, token, userName)
            dispatch({
                type: "addEventComment",
                payload: { eventId, comment: added.data },
            });
            setNewComment("")
        } catch (error) {
            console.error("Error adding comment:", error)
        }
    }

    // Editar un comentario
    const startEditing = (comment) => {
        setEditingId(comment.id)
        setEditingText(comment.content)
    }

    const handleUpdateComment = async (commentId) => {
        if (!editingText.trim()) return
        try {
            const updated = await servicesGetEvents.updateComment(commentId, editingText, token)
            dispatch({
                type: "updateEventComment",
                payload: { eventId, comment: updated.data },
            })
            setEditingId(null)
            setEditingText("")
        } catch (error) {
            console.error("Error updating comment:", error)
        }
    }

    // Eliminar un comentario
    const handleDeleteComment = async (commentId) => {
        try {
            await servicesGetEvents.deleteComment(commentId, token)
            dispatch({
                type: "deleteEventComment",
                payload: { eventId, commentId },
            })
        } catch (error) {
            console.error("Error deleting comment:", error)
        }
    }

    return (

        <div className="event-comments mt-4">
            <h5>Comments</h5>

            <div className="bg-dark bg-gradient rounded overflow-y-auto" style={{maxHeight: "300px"}}>
                <div className="comments-list text-white border border-0 ">
                    {store.comments[eventId]?.length === 0 && <p>No comments yet.</p>}
                    {store.comments[eventId]?.map((comment) => (
                        <div key={comment.id} className="comment mb-2 p-2 border border-0 ">
                            <div className="d-flex justify-content-between">
                                <strong>{comment.user_name || "Anonymous"}</strong>
                                {comment.user_id === userId && (
                                    <div>
                                        <button
                                            className="btn btn-sm border border-white me-1"
                                            onClick={() => startEditing(comment)}
                                        >
                                            <i className="fa-solid fa-pencil text-white"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm border border-danger"
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            <i className="fa-solid fa-trash text-white"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                            {editingId === comment.id ? (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-sm border border-success me-1"
                                        onClick={() => handleUpdateComment(comment.id)}
                                    >
                                        <i className="fa-solid fa-check text-white"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm border border-danger"
                                        onClick={() => setEditingId(null)}
                                    >
                                        <i className="fa-solid fa-x text-white"></i>
                                    </button>
                                </div>
                            ) : (
                                <p className="mb-0 mt-1">{comment.content}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="row mb-5">
                {isAuth && (
                    <div className="col-12 mb-4">
                        <div className="input-group mt-3">
                            <input
                                type="text"
                                className="form-control border border-dark"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddComment();
                                }}
                            />
                            <button
                                className="btn btn cta"
                                type="button"
                                onClick={handleAddComment}
                            >
                                Add Comment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EventComments