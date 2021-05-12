import React from 'react'
import Overview from './pages/Overview'
import { Route } from 'react-router-dom'

const SushiPro = () => {
    return <Route exact strict path="/sushipro" component={Overview} />
}

export default SushiPro
