import {combineReducers} from 'redux';
import videoReducer from './VideoReducer';

export default combineReducers({
  video: videoReducer,
});
