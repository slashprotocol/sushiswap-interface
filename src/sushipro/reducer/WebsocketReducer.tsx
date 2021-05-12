import { Reducer } from 'react'
import { Action, ActionType, State } from '../entities/websocketTypes'

const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case ActionType.UPDATE_STATUS: {
            const { connected } = action.payload
            return {
                ...state,
                connected
            }
        }
    }
}

export default reducer
