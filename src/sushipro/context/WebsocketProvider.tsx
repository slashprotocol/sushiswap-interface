import React, { createContext, FC, useCallback, useMemo, useReducer } from 'react'
import { ActionType, State } from '../entities/websocketTypes'
import reducer from '../reducer/WebsocketReducer'
import Loader from '../../components/Loader'

export const initialState: State = {
    connected: false
}

const WebsocketContext = createContext<[State, { updateStatus: (status: boolean) => void }]>([
    initialState,
    { updateStatus: (_: boolean) => null }
])

const Provider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const updateStatus = useCallback(connected => {
        dispatch({
            type: ActionType.UPDATE_STATUS,
            payload: {
                connected
            }
        })
    }, [])

    return (
        <WebsocketContext.Provider value={useMemo(() => [state, { updateStatus }], [state, updateStatus])}>
            {state.connected ? children : <Loader />}
        </WebsocketContext.Provider>
    )
}

export default Provider
