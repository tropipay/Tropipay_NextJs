import React, { useReducer } from "react"
import { multiStepReducer } from "./multiStepReducer"

const MultiStepWizard = ({ steps, initialData = {}, onFinish }) => {
  const [state, dispatch] = useReducer(multiStepReducer, {
    step: 0,
    data: initialData,
  })

  const CurrentStepComponent = steps[state.step]

  const next = () => {
    if (state.step === steps.length - 1) {
      onFinish?.(state.data)
    } else {
      dispatch({ type: "NEXT" })
    }
  }
  const prev = () => dispatch({ type: "PREV" })
  const setStep = (index) => dispatch({ type: "SET_STEP", payload: index })
  const setData = (data) => dispatch({ type: "SET_DATA", payload: data })
  const reset = () =>
    dispatch({ type: "RESET", payload: { step: 0, data: initialData } })

  const context = {
    stepIndex: state.step,
    data: state.data[`step${state.step}`] || {},
    fullData: state.data,
    next,
    prev,
    setStep,
    setData,
    reset,
    onFinish,
  }

  return <CurrentStepComponent {...context} />
}

export default MultiStepWizard
