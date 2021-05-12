import React from 'react'
import Swap from '../../pages/Swap'
import TradingViewWidget, { Themes, BarStyles } from 'react-tradingview-widget'
import SwapTable from '../components/SwapTable'
import Helmet from 'react-helmet'

const Overview = () => {
    return (
        <>
            <Helmet>
                <title>SushiPro | Sushi</title>
            </Helmet>
            <div className="max-w-screen-xl mx-auto w-full h-full">
                <div className="h-64 grid grid-cols-2 gap-4">
                    <div>
                        <Swap />
                    </div>
                    <div>
                        <TradingViewWidget
                            symbol="BINANCE:SUSHIUSDT"
                            theme={Themes.DARK}
                            locale="en"
                            autosize={false}
                            range="5d"
                            withdateranges={true}
                            width="100%"
                            height={window.innerHeight - 180}
                            style={BarStyles.CANDLES}
                            save_image={false}
                            details={false}
                            hide_side_toolbar={true}
                            hide_legend={true}
                            hideideas={true}
                        />
                    </div>
                    <div className="col-span-2">
                        <SwapTable />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Overview
