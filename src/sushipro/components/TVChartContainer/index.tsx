import * as React from 'react'
import './index.css'

interface TVChartContainerProps {
    containerId: string
}

const TVChartContainer = ({ containerId }: TVChartContainerProps) => {
    // useEffect(() => {
    //     const tvWidget = new widget({
    //         symbol: symbol,
    //         // BEWARE: no trailing slash is expected in feed URL
    //         datafeed: 'https://demo_feed.tradingview.com',
    //         interval: 'D',
    //         container_id: containerId,
    //         library_path: '/charting_library/',
    //
    //         // TODO
    //         locale: 'en',
    //         disabled_features: ['use_localstorage_for_settings'],
    //         enabled_features: ['study_templates'],
    //         charts_storage_url: 'https://saveload.tradingview.com',
    //         charts_storage_api_version: '1.1',
    //         client_id: 'tradingview.com',
    //         user_id: 'public_user_id',
    //         fullscreen: false,
    //         autosize: true,
    //         studies_overrides: {}
    //     })
    //
    //     tvWidget.onChartReady(() => {
    //         tvWidget.headerReady().then(() => {
    //             const button = tvWidget.createButton()
    //             button.setAttribute('title', 'Click to show a notification popup')
    //             button.classList.add('apply-common-tooltip')
    //             button.addEventListener('click', () =>
    //                 tvWidget.showNoticeDialog({
    //                     title: 'Notification',
    //                     body: 'TradingView Charting Library API works correctly',
    //                     callback: () => {
    //                         console.log('Noticed!')
    //                     }
    //                 })
    //             )
    //
    //             button.innerHTML = 'Check API'
    //         })
    //     })
    //
    //     return () => {
    //         tvWidget.remove()
    //     }
    // }, [containerId, symbol])

    return <div id={containerId} />
}

export default TVChartContainer
