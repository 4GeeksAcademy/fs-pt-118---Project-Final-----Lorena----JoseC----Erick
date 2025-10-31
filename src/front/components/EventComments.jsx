import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import servicesGetEvents from "../Services/servicesGetEvents";

const EventComments = ({ eventId }) => {

    const { store } = useGlobalReducer()
    const token = localStorage.getItem("token")
    const isAuth = !!store?.isAuth
    const userId = Number (store?.user?.id)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [editingText, setEditingText] = useState("")

    // Obtener comentarios
    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await servicesGetEvents.getComments(eventId, token)
                setComments(data.data || [])
            } catch (error) {
                console.error("Error loading comments:", error)
            }
        }
        loadComments()
    }, [eventId, token])

    // Agregar comentario
    const handleAddComment = async () => {
        if (!newComment.trim()) return
        if (!isAuth) {
            return
        }
        try {
            const added = await servicesGetEvents.addComment(eventId, newComment, token)
            setComments(prev => [...prev, added.data])
            setNewComment("")
        } catch (error) { }
    }

    // Editar comentario
    const startEditing = (comment) => {
        setEditingId(comment.id)
        setEditingText(comment.content)
    }

    const handleUpdateComment = async (commentId) => {
        if (!editingText.trim()) return
        try {
            const updated = await servicesGetEvents.updateComment(commentId, editingText, token)
            setComments(prev => prev.map(c => c.id === commentId ? updated.data : c))
            setEditingId(null)
            setEditingText("")
        } catch (error) {
        }
    }

    // Eliminar comentario
    const handleDeleteComment = async (commentId) => {
        try {
            await servicesGetEvents.deleteComment(commentId, token)
            setComments(prev => prev.filter(c => c.id !== commentId))
        } catch (error) {
        }
    }

    return (

        <div className="event-comments mt-4">
            <h5>Comments</h5>

            <div className="bg-dark bg-gradient rounded">
                <div className="comments-list text-white border border-0">
                    {comments.length === 0 && <p>No comments yet.</p>}
                    {comments.map(comment => (
                        <div key={comment.id} className="comment mb-2 p-2 border border-0">
                            <div className="d-flex justify-content-between">
                                <strong>{comment.nick_name || "Anonymous"}</strong>
                                {comment.user_id === userId && (
                                    <div>
                                        <button className="btn btn-sm border border-white me-1" onClick={() => startEditing(comment)}><i className="fa-solid fa-pencil text-white"></i></button>
                                        <button className="btn btn-sm border border-danger" onClick={() => handleDeleteComment(comment.id)}><i className="fa-solid fa-trash text-white"></i></button>
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
                                    <button className="btn btn-sm border border-success me-1" onClick={() => handleUpdateComment(comment.id)}><i className="fa-solid fa-check text-white"></i></button>
                                    <button className="btn btn-sm border border-danger" onClick={() => setEditingId(null)}><i className="fa-solid fa-x text-white"></i></button>
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
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control border border-dark "
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "") handleAddComment();
                                }}
                            />
                            <button
                                className="btn btn-dark bg-gradient"
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