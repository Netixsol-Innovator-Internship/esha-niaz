'use client';
import { useCreateCommentMutation, useGetAllCommentsQuery } from '../../services/commentApi';
import CommentItem from '../../components/CommentItem';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
import { useState } from 'react';

export default function CommentsPage(){
  const { token } = useSelector(s=>s.auth);
  const router = useRouter();
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const { data, isFetching } = useGetAllCommentsQuery({ page:1, limit:20 }, { skip: !token });

  if (!token) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const onSubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const content = fd.get('content');

  if (!content?.trim()) return;

  try {
    await createComment({ content }).unwrap();
    setContent(''); // ✅ clears input instantly after success
  } catch (err) {
    // error is already toasted in commentApi
  }
};

  // ✅ controlled state for textarea
  const [content, setContent] = useState('');

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const fd = new FormData(e.currentTarget);
  //   const content = fd.get('content');
  //   // original
  //   // try{
  //   //   await createComment({ content }).unwrap();
  //   //   e.currentTarget.reset();
  //   //   toast.success('Comment posted');
  //   // }catch(err){
  //   //   toast.error(err?.data?.message || 'Failed to post');
  //   // }
  //   //chatgpt fix
  //     // try {
  //   await createComment({ content })
  //   e.currentTarget.reset();
  //   toast.success('Comment posted');
  // // } catch (err) {
  // //   // If the server succeeded but RTKQ failed to parse the body, it looks like:
  // //   // { status: 'PARSING_ERROR', originalStatus: 200/201, ... }
  // //   const parsingSuccess =
  // //     err?.status === 'PARSING_ERROR' && (err?.originalStatus === 200 || err?.originalStatus === 201);

  // //   if (parsingSuccess) {
  // //     e.currentTarget.reset();
  // //     toast.success('Comment posted');
  // //     return;
  // //   }

  // //   toast.error(err?.data?.message || 'Failed to post');
  // // }
  // };

  return (
    <div className="list">
      <form className="card" onSubmit={onSubmit}>
        <h2>Create a Comment</h2>
        <textarea name="content" placeholder="Write something..." required minLength={2}  value={content}  onChange={(e) => setContent(e.target.value)} />
        <button className="primary" disabled={isLoading}>{isLoading? 'Posting...':'Post Comment'}</button>
      </form>

      {/* {isFetching ? <div className="meta">Loading comments...</div> : (
        <div className="list">
          {data?.comments?.length ? data.comments.map(c => (
            <CommentItem key={c.id} comment={c} />
          )) : <div className="meta">No comments yet</div>}
        </div>
      )} */}
      {isFetching && !data ? (
  <div className="meta">Loading comments...</div>
) : (
  <div className="list">
    {data?.comments?.length ? data.comments.map(c => (
      <CommentItem key={c.id} comment={c} />
    )) : <div className="meta">No comments yet</div>}
  </div>
)}
    </div>
  );
}
