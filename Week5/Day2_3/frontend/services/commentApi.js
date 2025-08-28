'use client';
import { baseApi } from './baseApi';
import toast from 'react-hot-toast';

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // original one
    // createComment: builder.mutation({
    //   query: (body) => ({ url: '/comments', method: 'POST', body }),
    //   invalidatesTags: ['Comments'],
    // }),
    // chatgpt fix
    // ====== CREATE COMMENT ======
createComment: builder.mutation({
  query: (body) => ({
    url: '/comments',
    method: 'POST',
    body,
  }),
  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      // ✅ success toast here instead of in component
      toast.success('Comment posted');
      // optimistic update if needed
      dispatch(
        baseApi.util.updateQueryData('getAllComments', { page:1, limit:20 }, (draft) => {
          draft.comments.unshift(data.comment);
        })
      );
    } catch (err) {
      // ✅ only show error if the FINAL attempt failed
      toast.error(err?.error?.data?.message || 'Failed to post comment');
    }
  },
}),



    createReply: builder.mutation({
      query: (body) => ({ url: '/comments', method: 'POST', body }),
      invalidatesTags: (r,e,arg)=> ['Comments', {type:'Replies', id: arg?.parentId}],
    }),
    getAllComments: builder.query({
      query: ({page=1,limit=10,userId}={}) => {
        const q = new URLSearchParams();
        q.set('page', String(page)); q.set('limit', String(limit));
        if (userId) q.set('userId', userId);
        return { url: `/comments?${q.toString()}` };
      },
      providesTags: ['Comments'],
    }),
    getCommentById: builder.query({
      query: (id) => ({ url: `/comments/${id}` }),
      providesTags: (_r,_e,id)=> [{type:'Comment', id}],
    }),
    getReplies: builder.query({
      query: ({id,page=1,limit=5}) => ({ url: `/comments/${id}/replies?page=${page}&limit=${limit}` }),
      providesTags: (_r,_e,arg)=> [{type:'Replies', id: arg.id}],
    }),
    updateComment: builder.mutation({
      query: ({id,content}) => ({ url: `/comments/${id}`, method: 'PUT', body: { content } }),
      invalidatesTags: (_r,_e,arg)=> ['Comments', {type:'Comment', id: arg.id}],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({ url: `/comments/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Comments'],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useCreateReplyMutation,
  useGetAllCommentsQuery,
  useGetCommentByIdQuery,
  useGetRepliesQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;




// 'use client';
// import { baseApi } from './baseApi';

// export const commentApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({

//     // ====== CREATE COMMENT ======
//     createComment: builder.mutation({
//       query: (body) => ({ url: '/comments', method: 'POST', body }),
//       // No invalidatesTags — we patch cache instead to avoid loading flicker
//       async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
//         const state = getState();
//         const me = state?.auth?.user || {};
//         const tempId = `temp-${Date.now()}`;

//         // Optimistically add the new comment to page 1 caches
//         const patchers = [
//           dispatch(
//             baseApi.util.updateQueryData('getAllComments', undefined, (draft) => {
//               if (!draft?.comments) return;
//               draft.comments.unshift({
//                 id: tempId,
//                 content: arg?.content,
//                 author: me,
//                 parentId: null,
//                 likesCount: 0,
//                 repliesCount: 0,
//                 isEdited: false,
//                 createdAt: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 _optimistic: true,
//               });
//               if (typeof draft.total === 'number') draft.total += 1;
//             })
//           ),
//           // In case your list is sometimes called with explicit defaults
//           dispatch(
//             baseApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//               if (!draft?.comments) return;
//               draft.comments.unshift({
//                 id: tempId,
//                 content: arg?.content,
//                 author: me,
//                 parentId: null,
//                 likesCount: 0,
//                 repliesCount: 0,
//                 isEdited: false,
//                 createdAt: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 _optimistic: true,
//               });
//               if (typeof draft.total === 'number') draft.total += 1;
//             })
//           ),
//         ];

//         try {
//           const { data } = await queryFulfilled; // { message, comment }
//           const real = data?.comment;
//           patchers.push(
//             dispatch(
//               baseApi.util.updateQueryData('getAllComments', undefined, (draft) => {
//                 if (!draft?.comments) return;
//                 const idx = draft.comments.findIndex((c) => c.id === tempId);
//                 if (idx !== -1 && real) draft.comments[idx] = real;
//               })
//             ),
//             dispatch(
//               baseApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//                 if (!draft?.comments) return;
//                 const idx = draft.comments.findIndex((c) => c.id === tempId);
//                 if (idx !== -1 && real) draft.comments[idx] = real;
//               })
//             )
//           );
//         } catch {
//           // Rollback all optimistic patches on error
//           patchers.forEach((p) => p.undo && p.undo());
//         }
//       },
//     }),

//     // ====== CREATE REPLY ======
//     createReply: builder.mutation({
//       query: (body) => ({ url: '/comments', method: 'POST', body }),
//       async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
//         const state = getState();
//         const me = state?.auth?.user || {};
//         const tempId = `temp-reply-${Date.now()}`;
//         const parentId = arg?.parentId;

//         // Optimistically add reply to replies cache for the parent
//         const replyPatch = dispatch(
//           baseApi.util.updateQueryData('getReplies', { id: parentId, page: 1, limit: 5 }, (draft) => {
//             if (!draft?.replies) return;
//             draft.replies.unshift({
//               id: tempId,
//               content: arg?.content,
//               author: me,
//               parentId,
//               likesCount: 0,
//               repliesCount: 0,
//               isEdited: false,
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//               _optimistic: true,
//             });
//           })
//         );

//         // Also bump repliesCount on the parent in the main list if present
//         const listPatchers = [
//           dispatch(
//             baseApi.util.updateQueryData('getAllComments', undefined, (draft) => {
//               const idx = draft?.comments?.findIndex((c) => c.id === parentId);
//               if (idx != null && idx !== -1) draft.comments[idx].repliesCount += 1;
//             })
//           ),
//           dispatch(
//             baseApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//               const idx = draft?.comments?.findIndex((c) => c.id === parentId);
//               if (idx != null && idx !== -1) draft.comments[idx].repliesCount += 1;
//             })
//           ),
//         ];

//         try {
//           const { data } = await queryFulfilled; // { message, comment }
//           const real = data?.comment;
//           // Replace optimistic reply with real one
//           dispatch(
//             baseApi.util.updateQueryData('getReplies', { id: parentId, page: 1, limit: 5 }, (draft) => {
//               if (!draft?.replies) return;
//               const i = draft.replies.findIndex((r) => r.id === tempId);
//               if (i !== -1 && real) draft.replies[i] = real;
//             })
//           );
//         } catch {
//           replyPatch.undo && replyPatch.undo();
//           listPatchers.forEach((p) => p.undo && p.undo());
//         }
//       },
//     }),

//     // ====== LIST COMMENTS ======
//     getAllComments: builder.query({
//       query: ({ page = 1, limit = 10, userId } = {}) => {
//         const q = new URLSearchParams();
//         q.set('page', String(page));
//         q.set('limit', String(limit));
//         if (userId) q.set('userId', userId);
//         return { url: `/comments?${q.toString()}` };
//       },
//       providesTags: ['Comments'],
//       // Prevent unnecessary “refetch → isFetching=true” flashes
//       refetchOnFocus: false,
//       refetchOnReconnect: false,
//     }),

//     // ====== SINGLE COMMENT ======
//     getCommentById: builder.query({
//       query: (id) => ({ url: `/comments/${id}` }),
//       providesTags: (_r, _e, id) => [{ type: 'Comment', id }],
//       refetchOnFocus: false,
//       refetchOnReconnect: false,
//     }),

//     // ====== REPLIES ======
//     getReplies: builder.query({
//       query: ({ id, page = 1, limit = 5 }) => ({
//         url: `/comments/${id}/replies?page=${page}&limit=${limit}`,
//       }),
//       providesTags: (_r, _e, arg) => [{ type: 'Replies', id: arg.id }],
//       refetchOnFocus: false,
//       refetchOnReconnect: false,
//     }),

//     // ====== UPDATE COMMENT ======
//     updateComment: builder.mutation({
//       query: ({ id, content }) => ({ url: `/comments/${id}`, method: 'PUT', body: { content } }),
//       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
//         // Optimistically update the list
//         const patchers = [
//           dispatch(
//             baseApi.util.updateQueryData('getAllComments', undefined, (draft) => {
//               const idx = draft?.comments?.findIndex((c) => c.id === arg.id);
//               if (idx != null && idx !== -1) {
//                 draft.comments[idx].content = arg.content;
//                 draft.comments[idx].isEdited = true;
//                 draft.comments[idx].updatedAt = new Date().toISOString();
//               }
//             })
//           ),
//           dispatch(
//             baseApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//               const idx = draft?.comments?.findIndex((c) => c.id === arg.id);
//               if (idx != null && idx !== -1) {
//                 draft.comments[idx].content = arg.content;
//                 draft.comments[idx].isEdited = true;
//                 draft.comments[idx].updatedAt = new Date().toISOString();
//               }
//             })
//           ),
//           // And the detail cache if present
//           dispatch(
//             baseApi.util.updateQueryData('getCommentById', arg.id, (draft) => {
//               if (!draft) return;
//               draft.comment = draft.comment || draft; // handle both shapes
//               if (draft.comment?.id === arg.id) {
//                 draft.comment.content = arg.content;
//                 draft.comment.isEdited = true;
//                 draft.comment.updatedAt = new Date().toISOString();
//               } else if (draft?.id === arg.id) {
//                 draft.content = arg.content;
//                 draft.isEdited = true;
//                 draft.updatedAt = new Date().toISOString();
//               }
//             })
//           ),
//         ];

//         try {
//           await queryFulfilled; // server has final state already
//         } catch {
//           patchers.forEach((p) => p.undo && p.undo());
//         }
//       },
//     }),

//     // ====== DELETE COMMENT ======
//     deleteComment: builder.mutation({
//       query: (id) => ({ url: `/comments/${id}`, method: 'DELETE' }),
//       async onQueryStarted(id, { dispatch, queryFulfilled }) {
//         // Optimistically remove from lists
//         const patchers = [
//           dispatch(
//             baseApi.util.updateQueryData('getAllComments', undefined, (draft) => {
//               if (!draft?.comments) return;
//               const before = draft.comments.length;
//               draft.comments = draft.comments.filter((c) => c.id !== id);
//               if (typeof draft.total === 'number' && draft.comments.length < before) draft.total -= 1;
//             })
//           ),
//           dispatch(
//             baseApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//               if (!draft?.comments) return;
//               const before = draft.comments.length;
//               draft.comments = draft.comments.filter((c) => c.id !== id);
//               if (typeof draft.total === 'number' && draft.comments.length < before) draft.total -= 1;
//             })
//           ),
//         ];

//         try {
//           await queryFulfilled;
//         } catch {
//           patchers.forEach((p) => p.undo && p.undo());
//         }
//       },
//     }),

//   }),
// });

// export const {
//   useCreateCommentMutation,
//   useCreateReplyMutation,
//   useGetAllCommentsQuery,
//   useGetCommentByIdQuery,
//   useGetRepliesQuery,
//   useUpdateCommentMutation,
//   useDeleteCommentMutation,
// } = commentApi;
