import { useState, useRef } from 'react'
import TagsInput from './TagsInput'
import { useSelector } from 'react-redux'
import { getPostsBySearch } from '../../services/posts'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import { checkUserToken } from '../../../services/checkUserToken'
import { toast } from 'react-toastify'
import { logUserOut } from '../../slices/authSlice'
import { checkUserToken } from '../../services/checkUserToken'
// import { logUserOut } from '../../../slices/authSlice'

function SearchForm() {
  const [tagInputs, setTagInputs] = useState([])
  const { user } = useSelector((state) => state.auth)
  const inpRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSearch = () => {

     if (!user) {
          toast.error('You are not Logged In!')
          return
        }
    
        // checks if login token is still valid
        if (!checkUserToken()) {
          toast.info('Session Expired!')
          dispatch(logUserOut())
          return
        }
    // console.log('search - 1')
    if (!inpRef.current.value && tagInputs.length === 0) return
    // console.log('search - 2')
    const searchQuery = {
      title: inpRef.current.value,
      tags: tagInputs.join(','),
    }
    dispatch(getPostsBySearch(searchQuery, 1))
    navigate(
      `/posts?page=1&title=${searchQuery.title || 'none'}&tags=${
        searchQuery.tags || 'none'
      }`
    )
    inpRef.current.value = ''
    setTagInputs([])
    // console.log('search data.........', searchQuery)
  }

  return (
    <div className='w-full rounded-lg shadow-lg p-6 mb-6 space-y-4 transparentCard'>
      <input
        type='search'
        placeholder='Search Blogs'
        ref={inpRef}
        className='border-[1px] w-full border-slate-400 p-2 rounded-md bg-transparent placeholder:text-gray-700'
      />
      <TagsInput
        tagInputs={tagInputs}
        setTagInputs={setTagInputs}
        user={user}
        noAuth={true}
      />
      <button
        className='bg-yellow-400 text-white w-full p-2 rounded-md'
        onClick={handleSearch}
      >
        Search Blogs
      </button>
    </div>
  )
}

export default SearchForm
