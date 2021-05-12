interface WebsocketReducerAction<T, P> {
    type: T
    payload: P
}

interface UpdateStatusPayload {
    connected: boolean
}

export enum ActionType {
    UPDATE_STATUS = 'UPDATE_STATUS'
}

export interface State {
    connected: boolean
}

export type Action = WebsocketReducerAction<ActionType.UPDATE_STATUS, UpdateStatusPayload>
