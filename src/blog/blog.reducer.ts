import { Post } from 'types/blog.type'
import {
  PayloadAction,
  createAction,
  createReducer,
  createSlice,
  current,
  nanoid
} from '@reduxjs/toolkit'
import { initalPostList } from 'constants/blog'
interface BlogState {
  postList: Post[]
  itemEdit: Post | null
}

const initialState: BlogState = {
  postList: initalPostList,
  itemEdit: null
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    deleteItemPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      console.log(current(state))
      state.postList = state.postList.filter((item) => item.id !== postId)
    },
    editingItemPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      state.itemEdit = state.postList.find((item) => item.id === postId) || null
    },
    cancelEditingItemPost: (state) => {
      state.itemEdit = null
      console.log(current(state))
    },
    finishEditingItemPost: (state, action: PayloadAction<Post>) => {
      const postId = action.payload.id
      state.postList.some((item, index) => {
        if (item.id !== postId) return false
        state.postList[index] = action.payload
        return false
      })
      state.itemEdit = null
    },
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        const post = action.payload
        state.postList.push(post)
      },
      prepare: (post: Omit<Post, 'id'>) => {
        return {
          payload: {
            ...post,
            id: nanoid() // id tự sinh ra được redux hỗ trợ
          }
        }
      }
    }
  }
})
export const {
  addPost,
  cancelEditingItemPost,
  deleteItemPost,
  editingItemPost,
  finishEditingItemPost
} = blogSlice.actions

const blogReducer = blogSlice.reducer
export default blogReducer

/** 
export const addPost = createAction(
  'blog/addPost',
  function (post: Omit<Post, 'id'>) {
    return {
      payload: {
        ...post,
        id: nanoid() // id tự sinh ra được redux hỗ trợ
      }
    }
  }
)
export const deleteItemPost = createAction<String>('blog/deleteItemPost')
export const editingItemPost = createAction<String>('blog/editingItem')
export const cancelEditingItemPost = createAction('blog/cancelEditingItemPost')
export const finishEditingItemPost = createAction<Post>(
  'blog/finishEditingItemPost'
)

const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      const post = action.payload
      state.postList.push(post)
    })
    .addCase(deleteItemPost, (state, action) => {
      const postId = action.payload
      console.log(current(state))
      // state.postList.filter((item) => item.id !== postId)
      // const foundPostIndex = state.postList.findIndex(
      //   (post) => post.id === postId
      // )
      // if (foundPostIndex !== -1) {
      //   state.postList.splice(foundPostIndex, 1)
      // }
      state.postList = state.postList.filter((item) => item.id !== postId)
    })
    .addCase(editingItemPost, (state, action) => {
      const postId = action.payload
      state.itemEdit = state.postList.find((item) => item.id === postId) || null
    })
    .addCase(cancelEditingItemPost, (state, action) => {
      state.itemEdit = null
      console.log(current(state))
    })
    .addCase(finishEditingItemPost, (state, action) => {
      const postId = action.payload.id
      state.postList.some((item, index) => {
        if (item.id !== postId) return false
        state.postList[index] = action.payload
        return false
      })
      state.itemEdit = null
    })
    .addMatcher(
      (action) => action.type.includes('delete'),
      (state, action) => {
        console.log(current(state))
      }
    )
})
*/

/** 
// Cách dưới tiện hơn nhưng lại khó setup typescript hơn, nếu dùng với js thông thường thì rất nhanh và tiện
// const blogReducer = createReducer(
//   initialState,
//   {
//     [addPost.type]: (state, action: PayloadAction<Post>) => {
//       const post = action.payload
//       state.postList.push(post)
//     },
//     [deleteItemPost.type]: (state, action) => {
//       const postId = action.payload
//       console.log(current(state))
//       state.postList = state.postList.filter((item) => item.id !== postId)
//     },
//     [editingItemPost.type]: (state, action) => {
//       const postId = action.payload
//       state.itemEdit = state.postList.find((item) => item.id === postId) || null
//     },
//     [cancelEditingItemPost.type]: (state, action) => {
//       state.itemEdit = null
//       console.log(current(state))
//     },
//     [finishEditingItemPost.type]: (state, action) => {
//       const postId = action.payload.id
//       state.postList.some((item, index) => {
//         if (item.id !== postId) return false
//         state.postList[index] = action.payload
//         return false
//       })
//       state.itemEdit = null
//     }
//   },
//   [
//     {
//       matcher: ((action: any) => action.type.includes('cancel')) as any,
//       reducer(state, action) {
//         console.log('cancel', current(state))
//       }
//     }
//   ],
//   (state) => {
//     console.log('default', state)
//   }
// )
*/
// export default blogReducer
