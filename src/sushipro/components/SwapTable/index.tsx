import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import { Card } from '../../../kashi'
import ListHeaderWithSort from '../../../kashi/components/ListHeaderWithSort'
import { t, Trans } from '@lingui/macro'
import ListHeader from '../ListHeader'
import { useLingui } from '@lingui/react'
import AsyncTokenIcon from '../../../kashi/components/AsyncTokenIcon'
import { formattedNum } from '../../../utils'

enum OrderDirection {
    BUY = 'BUY',
    SELL = 'SELL'
}

interface SwapMessage {
    address: string
    symbol: string
    side: OrderDirection
    input: number
    output: number
}

const SwapTable = () => {
    const { i18n } = useLingui()
    const { sendMessage, lastMessage } = useWebSocket('wss://ws-eu.pusher.com/app/068f5f33d82a69845215')
    const messageHistory = useRef<SwapMessage[]>([])

    const parseMessage = useCallback(async (message: MessageEvent | null) => {
        if (!message) return

        try {
            const msg = JSON.parse(message.data)
            if ('data' in msg) {
                const parsedData = JSON.parse(msg.data)
                if (parsedData && parsedData.message) {
                    const [address, symbol, side, input, output] = JSON.parse(parsedData.message)
                    messageHistory.current.push({ address, symbol, side, input, output })
                }
            }
        } catch (e) {}
    }, [])

    useEffect(() => {
        sendMessage(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: 'live_transactions' } }))
    }, [])

    // Parse message on every render
    parseMessage(lastMessage)

    return (
        <Card className="h-full bg-dark-900">
            <div className="grid gap-2 grid-flow-col grid-cols-4 md:grid-cols-6 lg:grid-cols-7 pb-2 px-4 text-sm text-secondary">
                <ListHeader>{i18n._(t`Date`)}</ListHeader>
                <ListHeader>{i18n._(t`Side`)}</ListHeader>
                <ListHeader className="justify-end">{i18n._(t`Price`)}</ListHeader>
                <ListHeader className="justify-end">{i18n._(t`Amount`)}</ListHeader>
                <ListHeader className="justify-end">{i18n._(t`Total`)}</ListHeader>
                <ListHeader className="hidden md:flex justify-end">{i18n._(t`Maker`)}</ListHeader>
            </div>
            <div className="flex-col space-y-1">
                {messageHistory.current.map(({ symbol, side, input, output }, index) => {
                    const buy = side === OrderDirection.BUY
                    return (
                        <div key={index}>
                            <div className="grid gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-7 py-4 px-4 items-center align-center text-sm  rounded bg-dark-800 hover:bg-dark-pink">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center">{symbol}</div>
                                <div className={`hidden md:block ${buy ? 'text-green' : 'text-red'}`}>{side}</div>
                                <div className="text-right hidden lg:block">
                                    {formattedNum(buy ? output / input : input / output, true)}
                                </div>
                                <div className="text-right hidden md:block">{output}</div>
                                <div className="text-right hidden lg:block">{input}</div>
                                <div className="hidden md:block">Maker</div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/*<ul>*/}
            {/*    {messageHistory.current.map((message, idx) => (*/}
            {/*        <span key={idx}>{message.data}</span>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </Card>
    )
}

export default SwapTable

const json = {
    result: {
        status: 'ok',
        data: {
            event: 'swaps',
            pair: '0x...PairAddress',
            chainId: '1',
            swaps: [
                {
                    txHash: '0x...TxHash',
                    maker: '0x...MakerAddress',
                    amountBase: 'WBTC',
                    amountQuote: 'ETH',
                    price: 54984,
                    priceBase: 13.2786,
                    timestamp: 1620840958,
                    side: 'SELL'
                }
            ]
        }
    }
}
