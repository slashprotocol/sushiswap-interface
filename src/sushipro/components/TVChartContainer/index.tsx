import React, { FC } from 'react'
import TradingViewWidget, { Themes, BarStyles } from 'react-tradingview-widget'

const TVChartContainer: FC = () => {
    return (
        <TradingViewWidget
            symbol="BINANCE:SUSHIUSDT"
            theme={Themes.DARK}
            locale="en"
            autosize={true}
            range="5d"
            withdateranges={true}
            style={BarStyles.CANDLES}
            save_image={false}
            details={false}
            hide_side_toolbar={true}
            hide_legend={true}
            hideideas={true}
        />
    )
}

export default TVChartContainer
