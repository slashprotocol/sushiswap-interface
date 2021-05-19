import React from 'react'
import Overview from './pages/Overview'
import WalletRoute from '../components/WalletRoute'

const SushiPro = () => {
    return <WalletRoute exact strict path="/sushipro" component={Overview} />
}

export default SushiPro
