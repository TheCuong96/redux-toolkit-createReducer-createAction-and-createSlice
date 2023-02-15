import { Post } from 'types/blog.type'
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current
} from '@reduxjs/toolkit'
import http from 'utils/http'
interface BlogState {
  postList: Post[]
  itemEdit: Post | null
}

const initialState: BlogState = {
  postList: [],
  itemEdit: null
}

export const getPostList = createAsyncThunk(
  'blog/getPostList',
  async (_, thunkAPI) => {
    const response = await http.get<Post[]>('posts', {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const addPost = createAsyncThunk(
  'blog/addPost',
  async (body: Omit<Post, 'id'>, thunkAPI) => {
    const response = await http.post<Post>('posts', body, {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const editingPost = createAsyncThunk(
  'blog/editingPost',
  async (body: Post, thunkAPI) => {
    const response = await http.put<Post>(`posts/${body.id}`, body, {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (idPost: string, thunkAPI) => {
    const response = await http.delete<Post>(`posts/${idPost}`, {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    editingItemPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      state.itemEdit = state.postList.find((item) => item.id === postId) || null
    },
    cancelEditingItemPost: (state) => {
      state.itemEdit = null
      console.log(current(state))
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(editingPost.fulfilled, (state, action) => {
        const postId = action.payload.id
        state.postList.some((item, index) => {
          if (item.id !== postId) return false
          state.postList[index] = action.payload
          return false
        })
        state.itemEdit = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.meta.arg
        console.log('postId', postId)
        state.postList = state.postList.filter((item) => item.id !== postId)
      })
      .addMatcher(
        (action) => action.type.includes('delete'),
        (state) => {
          console.log('đã thỏa addMatcher:', current(state))
        }
      )
      .addDefaultCase((state, action) => {
        console.log('không thỏa addMatcher:', current(state))
      })
  }
})
export const { cancelEditingItemPost, editingItemPost } = blogSlice.actions

const blogReducer = blogSlice.reducer
export default blogReducer

//////////////////////////////////////////////////////////
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
    // addMatcher này khi nó thỏa true ở param callback ban đầu thì nó sẽ chạy hàm này, ở đây thì ta xử lý khi hàm nào mà trong đó có đoạn string 'delete' chạy thì nó sẽ thỏa true rồi chạy tới param thứ 2
      (action) => action.type.includes('delete'),
      (state, action) => {
        console.log(current(state))
      }
    )
})




/**
import { Post } from 'types/blog.type'
import {
  PayloadAction,
  createAction,
  createAsyncThunk,
  createReducer,
  createSlice,
  current,
  nanoid
} from '@reduxjs/toolkit'
import { initalPostList } from 'constants/blog'
import http from 'utils/http'
interface BlogState {
  postList: Post[]
  itemEdit: Post | null
}

const initialState: BlogState = {
  postList: [],
  itemEdit: null
}

export const getPostList = createAsyncThunk(
  'blog/getPostList',
  async (_, thunkAPI) => {
    const response = await http.get<Post[]>('posts', {
      // vì <React.StrictMode> của react tự động bắt lỗi gọi api tới 2 lần, nên ta tắt 1 lần đi bằng cách dùng thằng thunkAPI.signal
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const addPost = createAsyncThunk(
  'blog/addPost',
  async (body: Omit<Post, 'id'>, thunkAPI) => {
    const response = await http.post<Post>('posts', body, {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const editingPost = createAsyncThunk(
  'blog/editingPost',
  async (body: Post, thunkAPI) => {
    const response = await http.put<Post>(`posts/${body.id}`, body, {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (idPost: string, thunkAPI) => {
    const response = await http.delete<Post>(`posts/${idPost}`, {
      signal: thunkAPI.signal
    })
    return response.data
  }
)

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // không được xử lý bất đồng bộ hay call api trong reducers này
    // deleteItemPost: (state, action: PayloadAction<string>) => {
    //   const postId = action.payload
    //   console.log(current(state))
    //   state.postList = state.postList.filter((item) => item.id !== postId)
    // },
    editingItemPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      state.itemEdit = state.postList.find((item) => item.id === postId) || null
    },
    cancelEditingItemPost: (state) => {
      state.itemEdit = null
      console.log(current(state))
    }
    // finishEditingItemPost: (state, action: PayloadAction<Post>) => {
    //   const postId = action.payload.id
    //   state.postList.some((item, index) => {
    //     if (item.id !== postId) return false
    //     state.postList[index] = action.payload
    //     return false
    //   })
    //   state.itemEdit = null
    // }
    // addPost: {
    //   //  addPost này sẽ khóa lại vì bây giờ ta đã create lên thẳng server chứ không còn ở phía client nữa
    //   reducer: (state, action: PayloadAction<Post>) => {
    //     const post = action.payload
    //     state.postList.push(post)
    //   },
    //   prepare: (post: Omit<Post, 'id'>) => {
    //     // trước khi reducer phía trên của lệnh addPost này được chạy thì nó sẽ chạy thằng này trước để xử lý id hoặc điều gì khác mà ta muốn trước, rồi mới chạy vào reducer phía trên
    //     return {
    //       payload: {
    //         ...post,
    //         id: nanoid() // id tự sinh ra được redux hỗ trợ
    //       }
    //     }
    //   }
    // }
  },
  extraReducers(builder) {
    // vì những hàm addMatcher và hàm default sẽ không chạy ở reducers, nên ta phải add extraReducers này vào thì mới chạy được 2 hàm kìa
    // addMatcher này khi nó thỏa true ở param callback ban đầu thì nó sẽ chạy hàm này, ở đây thì ta xử lý khi hàm nào mà trong đó có đoạn string 'delete' chạy thì nó sẽ thỏa true rồi chạy tới param thứ 2
    // nếu nó không thỏa true ở addMatcher thì nó sẽ tự động chạy vào mặc định addDefaultCase
    builder
      // .addCase('blog/getPostListSuccess', (state, action: any) => {
      // // trong đây chỉ dùng cho dispatch thông thường
      //   state.postList = action.payload
      // })
      .addCase(getPostList.fulfilled, (state, action) => {
        // còn trong đây thì khi dùng createAsyncThunk nó sẽ trả về mặc định cho chúng ta 3 trạng thái : pending(đang lấy), fulfilled(đã lấy thành công hoặc đã hoàn thành), rejected(đã bị từ chối hoặc thất bại)
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(editingPost.fulfilled, (state, action) => {
        const postId = action.payload.id
        state.postList.some((item, index) => {
          if (item.id !== postId) return false
          state.postList[index] = action.payload
          return false
        })
        state.itemEdit = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.meta.arg
        console.log('postId', postId)
        state.postList = state.postList.filter((item) => item.id !== postId)
      })
      .addMatcher(
        (action) => action.type.includes('delete'),
        (state) => {
          console.log('đã thỏa addMatcher:', current(state))
        }
      )
      .addDefaultCase((state, action) => {
        console.log('không thỏa addMatcher:', current(state))
      })
  }
})
export const {
  // addPost,
  cancelEditingItemPost,
  // deleteItemPost,
  editingItemPost
  // finishEditingItemPost
} = blogSlice.actions

const blogReducer = blogSlice.reducer
export default blogReducer
*/

//////////////////////////////////////////////////////////
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
    // addMatcher này khi nó thỏa true ở param callback ban đầu thì nó sẽ chạy hàm này, ở đây thì ta xử lý khi hàm nào mà trong đó có đoạn string 'delete' chạy thì nó sẽ thỏa true rồi chạy tới param thứ 2
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
