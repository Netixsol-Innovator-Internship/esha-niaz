'use client';
import { useState } from 'react';
import { useDeleteCommentMutation, useUpdateCommentMutation, useCreateReplyMutation, useGetRepliesQuery } from '../services/commentApi';
import { useLikeCommentMutation, useUnlikeCommentMutation, useGetLikeStatusQuery } from '../services/likeApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function CommentItem({ comment }){
  const [editing, setEditing] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const auth = useSelector(s=>s.auth);
  const isOwner = auth?.user?._id === comment?.author?.id || auth?.user?.id === comment?.author?.id;

  const [del] = useDeleteCommentMutation();
  const [update] = useUpdateCommentMutation();
  const [reply] = useCreateReplyMutation();
  const [like] = useLikeCommentMutation();
  const [unlike] = useUnlikeCommentMutation();
  const { data: likeStatus } = useGetLikeStatusQuery(comment.id, { skip: !auth?.token });

  const { data: replies } = useGetRepliesQuery({ id: comment.id, page:1, limit:5 });

  const onSave = async (e)=>{
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const content = form.get('content');
    // doing extra 
      // Optimistic UI update
  // const oldContent = comment.content;
  // comment.content = content;
    try{
      await update({ id: comment.id, content }).unwrap();
      toast.success('Updated');
      setEditing(false);
    }catch(e){ 
      // comment.content = oldContent; // rollback on error
      toast.error(e?.data?.message || 'Failed'); }
  };

  const onReply = async ()=>{
    try{
      await reply({ content: replyText, parentId: comment.id }).unwrap();
      toast.success('Replied');
      setReplyText('');
      setReplyOpen(false);
    }catch(e){ toast.error(e?.data?.message || 'Failed'); }
  };

  const onLike = async ()=>{
    try{ await like({ commentId: comment.id }).unwrap(); }catch(e){}
  };
  const onUnlike = async ()=>{
    try{ await unlike(comment.id).unwrap(); }catch(e){}
  };

  return (
    <div className="comment">
      <div className="meta">
        <b>@{comment?.author?.username}</b>
        <span>• {new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      {!editing ? <div>{comment.content}</div> : (
        <form onSubmit={onSave}>
          <textarea name="content" defaultValue={comment.content} required/>
          <div className="actions">
            <button className="primary">Save</button>
            <button type="button" onClick={()=>setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
      <div className="actions">
        {likeStatus?.isLiked ? (
          <button onClick={onUnlike}>💔 Unlike</button>
        ) : (
          <button onClick={onLike}>❤️ Like</button>
        )}
        <button onClick={()=>setReplyOpen(v=>!v)}>↩️ Reply</button>
        {isOwner && <button onClick={()=>setEditing(v=>!v)}>✏️ Edit</button>}
        {isOwner && <button onClick={()=> del(comment.id).unwrap().then(()=>toast.success('Deleted')).catch(()=>toast.error('Failed'))}>🗑️ Delete</button>}
      </div>
      {replyOpen && (
        <div className="reply">
          <textarea placeholder="Write a reply..." value={replyText} onChange={e=>setReplyText(e.target.value)}/>
          <button className="primary" onClick={onReply} disabled={!replyText.trim()}>Reply</button>
        </div>
      )}
      {replies?.replies?.length ? (
        <div className="list reply">
          {replies.replies.map(r => (
            <div key={r.id} className="comment">
              <div className="meta">
                <b>@{r?.author?.username}</b>
                <span>• {new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div>{r.content}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}




// 'use client';
// import { useState } from 'react';
// import {
//   useDeleteCommentMutation,
//   useUpdateCommentMutation,
//   useCreateReplyMutation,
//   useGetRepliesQuery,
//   commentApi,
// } from '../services/commentApi';
// import {
//   useLikeCommentMutation,
//   useUnlikeCommentMutation,
//   useGetLikeStatusQuery,
//   likeApi,
// } from '../services/likeApi';
// import { useSelector, useDispatch } from 'react-redux';
// import toast from 'react-hot-toast';

// export default function CommentItem({ comment }) {
//   const [editing, setEditing] = useState(false);
//   const [replyOpen, setReplyOpen] = useState(false);
//   const [replyText, setReplyText] = useState('');
//   const auth = useSelector(s => s.auth);
//   const dispatch = useDispatch();

//   const isOwner =
//     auth?.user?._id === comment?.author?.id || auth?.user?.id === comment?.author?.id;

//   const [del] = useDeleteCommentMutation();
//   const [update] = useUpdateCommentMutation();
//   const [reply] = useCreateReplyMutation();
//   const [like] = useLikeCommentMutation();
//   const [unlike] = useUnlikeCommentMutation();
//   const { data: likeStatus } = useGetLikeStatusQuery(comment.id, { skip: !auth?.token });
//   const { data: replies } = useGetRepliesQuery({ id: comment.id, page: 1, limit: 5 });

//   const onSave = async (e) => {
//     e.preventDefault();
//     const form = new FormData(e.currentTarget);
//     const content = form.get('content');

//     // ✅ Optimistic UI update
//     const oldContent = comment.content;
//     dispatch(
//       commentApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//         const idx = draft.comments.findIndex(c => c.id === comment.id);
//         if (idx !== -1) draft.comments[idx].content = content;
//       })
//     );

//     try {
//       await update({ id: comment.id, content }).unwrap();
//       toast.success('Updated');
//       setEditing(false);
//     } catch (e) {
//       // rollback
//       dispatch(
//         commentApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//           const idx = draft.comments.findIndex(c => c.id === comment.id);
//           if (idx !== -1) draft.comments[idx].content = oldContent;
//         })
//       );
//       toast.error(e?.data?.message || 'Failed');
//     }
//   };

//   const onReply = async () => {
//     const tempReply = {
//       id: 'temp-' + Date.now(),
//       content: replyText,
//       createdAt: new Date().toISOString(),
//       author: auth.user,
//     };

//     // ✅ Optimistic UI update
//     dispatch(
//       commentApi.util.updateQueryData('getReplies', { id: comment.id, page: 1, limit: 5 }, (draft) => {
//         draft.replies.unshift(tempReply);
//       })
//     );

//     try {
//       await reply({ content: replyText, parentId: comment.id }).unwrap();
//       toast.success('Replied');
//     } catch (e) {
//       // rollback
//       dispatch(
//         commentApi.util.updateQueryData('getReplies', { id: comment.id, page: 1, limit: 5 }, (draft) => {
//           draft.replies = draft.replies.filter(r => r.id !== tempReply.id);
//         })
//       );
//       toast.error(e?.data?.message || 'Failed');
//     }

//     setReplyText('');
//     setReplyOpen(false);
//   };

//   const onDelete = async () => {
//     // ✅ Optimistic UI delete
//     dispatch(
//       commentApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//         draft.comments = draft.comments.filter(c => c.id !== comment.id);
//       })
//     );

//     try {
//       await del(comment.id).unwrap();
//       toast.success('Deleted');
//     } catch (e) {
//       toast.error('Failed');
//     }
//   };

//   const onLike = async () => {
//     // Optimistic like
//     dispatch(
//       likeApi.util.updateQueryData('getLikeStatus', comment.id, (draft) => {
//         if (draft) draft.isLiked = true;
//       })
//     );
//     try {
//       await like({ commentId: comment.id }).unwrap();
//     } catch {}
//   };

//   const onUnlike = async () => {
//     // Optimistic unlike
//     dispatch(
//       likeApi.util.updateQueryData('getLikeStatus', comment.id, (draft) => {
//         if (draft) draft.isLiked = false;
//       })
//     );
//     try {
//       await unlike(comment.id).unwrap();
//     } catch {}
//   };

//   return (
//     <div className="comment">
//       <div className="meta">
//         <b>@{comment?.author?.username}</b>
//         <span>• {new Date(comment.createdAt).toLocaleString()}</span>
//       </div>
//       {!editing ? (
//         <div>{comment.content}</div>
//       ) : (
//         <form onSubmit={onSave}>
//           <textarea name="content" defaultValue={comment.content} required />
//           <div className="actions">
//             <button className="primary">Save</button>
//             <button type="button" onClick={() => setEditing(false)}>Cancel</button>
//           </div>
//         </form>
//       )}
//       <div className="actions">
//         {likeStatus?.isLiked ? (
//           <button onClick={onUnlike}>💔 Unlike</button>
//         ) : (
//           <button onClick={onLike}>❤️ Like</button>
//         )}
//         <button onClick={() => setReplyOpen(v => !v)}>↩️ Reply</button>
//         {isOwner && <button onClick={() => setEditing(v => !v)}>✏️ Edit</button>}
//         {isOwner && <button onClick={onDelete}>🗑️ Delete</button>}
//       </div>

//       {replyOpen && (
//         <div className="reply">
//           <textarea
//             placeholder="Write a reply..."
//             value={replyText}
//             onChange={e => setReplyText(e.target.value)}
//           />
//           <button className="primary" onClick={onReply} disabled={!replyText.trim()}>
//             Reply
//           </button>
//         </div>
//       )}

//       {replies?.replies?.length ? (
//         <div className="list reply">
//           {replies.replies.map(r => (
//             <div key={r.id} className="comment">
//               <div className="meta">
//                 <b>@{r?.author?.username}</b>
//                 <span>• {new Date(r.createdAt).toLocaleString()}</span>
//               </div>
//               <div>{r.content}</div>
//             </div>
//           ))}
//         </div>
//       ) : null}
//     </div>
//   );
// }
