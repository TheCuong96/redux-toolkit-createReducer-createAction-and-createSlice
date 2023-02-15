import { useDispatch, useSelector } from 'react-redux'
import PostItem from '../PostItem'
import { RootState, useAppDispatch } from 'store'
import { useEffect } from 'react'
import http from 'utils/http'
import { getPostList } from 'blog/blog.reducer'

// gọi api trong useEffect()
// nếu gọi thành công thì dispatch action type: "blog/getPostListSuccess"
// nếu gọi thất bại thì dispatch action type: "blog/getPostListFailed"

// khi đã có data thì dispatch action type "blog/getPostList"

export default function PostList() {
  const postList = useSelector((state: RootState) => state.blog.postList)
  const dispatch = useAppDispatch()
  // const dispatch = useDispatch()
  /** 
   *  khi dùng thằng createAsyncThunk thì không nên dùng thằng này nữa
  useEffect(() => {
    const controller = new AbortController() // vì <React.StrictMode> của react tự động bắt lỗi gọi api tới 2 lần, nên ta tắt 1 lần đi bằng cách dùng thằng controller này và return về controller.abort() như bên dưới
    http
      .get('posts', { signal: controller.signal })
      .then((res) => {
        console.log(res)
        const data = res.data
        dispatch({ type: 'blog/getPostListSuccess', payload: data })
      })
      .catch((error) => {
        console.log(error)
        if (!(error.code === 'ERR_CANCELED')) {
          dispatch({ type: 'blog/getPostListFailed', payload: error })
        }
      })

    return () => {
      controller.abort()
    }
  }, [dispatch])
*/

  useEffect(() => {
    const promise = dispatch(getPostList())
    return () => promise.abort() // vì <React.StrictMode> của react tự động bắt lỗi gọi api tới 2 lần, nên ta tắt 1 lần đi bằng cách xử lý như vậy
  }, [dispatch])

  return (
    <div className='bg-white py-6 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
        <div className='mb-10 md:mb-16'>
          <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>
            Được Dev Blog
          </h2>
          <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
            Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ.
            Nhưng ngày mốt sẽ có nắng
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
          {postList.map((post, index) => {
            return <PostItem post={post} key={post.id} />
          })}
        </div>
      </div>
    </div>
  )
}
