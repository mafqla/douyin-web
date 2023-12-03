export interface GlobalState {
  userInfo?: {
    name?: string
    avatar?: string
    job?: string
    organization?: string
    location?: string
    email?: string
    permissions: Record<string, string[]>
  }
  userLoading?: boolean
}
const initialState: GlobalState = {
  userInfo: {
    permissions: {},
  },
}

export default function store(state = initialState, action) {
  switch (action.type) {
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
