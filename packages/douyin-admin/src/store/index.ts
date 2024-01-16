import defaultSettings from '../settings.json'
import { UserInfo } from '../api/types'

export interface GlobalState {
  settings?: typeof defaultSettings
  userInfo?: UserInfo
  userLoading?: boolean
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {},
}

export default function store(state = initialState, action) {
  switch (action.type) {
    case 'update-settings': {
      const { settings } = action.payload
      return {
        ...state,
        settings,
      }
    }
    case 'update-userInfo': {
      const { userInfo = initialState.userInfo, userLoading } = action.payload
      return {
        ...state,
        userLoading,
        userInfo,
      }
    }
    default:
      return state
  }
}
