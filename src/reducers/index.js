import { combineReducers } from 'redux'
import user from './user'
import repos from './repos'

export default combineReducers({
  user,
  repos
})
