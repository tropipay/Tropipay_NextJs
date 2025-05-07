export const multiStepReducer = (state, action) => {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: state.step + 1 }
    case "PREV":
      return {
        ...state,
        step: state.step - 1,
        data: {
          ...state.data,
          [`step${state.step}`]: undefined,
        },
      }
    case "SET_STEP":
      return { ...state, step: action.payload }
    case "SET_DATA":
      return {
        ...state,
        data: {
          ...state.data,
          [`step${state.step}`]: {
            ...(state.data[`step${state.step}`] || {}),
            ...action.payload,
          },
        },
      }
    case "RESET":
      return action.payload
    default:
      return state
  }
}
