import React, { useCallback, useEffect, useRef, FC } from 'react'
import useWebSocket from 'react-use-websocket'
import { Card } from '../../../kashi'
import { t } from '@lingui/macro'
import ListHeader from '../ListHeader'
import { useLingui } from '@lingui/react'
import { formattedNum } from '../../../utils'
import { useDerivedSwapInfo } from '../../../state/swap/hooks'
import ComponentHeader from '../ComponentHeader'
import { NETWORK_LABEL } from '../../../constants/networks'
import { ChainId } from '@sushiswap/sdk'

enum OrderDirection {
    BUY = 'BUY',
    SELL = 'SELL'
}

interface SwapMessage {
    chainId: ChainId
    amountBase: number
    side: OrderDirection
    timestamp: number
    price: number
    txHash: string
}

const SwapHistory: FC = () => {
    const { currencies } = useDerivedSwapInfo()
    const { i18n } = useLingui()
    const { sendMessage, lastMessage } = useWebSocket('wss://ws-eu.pusher.com/app/068f5f33d82a69845215')
    const messageHistory = useRef<SwapMessage[]>([])

    const parseMessage = useCallback(async (message: MessageEvent) => {
        try {
            const msg = JSON.parse(message.data)
            if ('data' in msg) {
                const parsedData = JSON.parse(msg.data)
                if (parsedData && parsedData.result && parsedData.result.status === 'ok') {
                    const chainId = parsedData.result.data.chainId
                    messageHistory.current.push(
                        ...parsedData.result.data.swaps.map(
                            ({ amountBase, side, timestamp, price, txHash }: SwapMessage) => ({
                                chainId,
                                amountBase,
                                side,
                                timestamp,
                                price,
                                txHash
                            })
                        )
                    )
                }
            }
        } catch (e) {}
    }, [])

    useEffect(() => {
        sendMessage(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: 'live_transactions' } }))
    }, [])

    useEffect(() => {
        if (!lastMessage) return

        parseMessage(lastMessage)
    }, [lastMessage, parseMessage])

    return (
        <>
            <ComponentHeader title={i18n._(t`Trades`)} />
            <div style={{ height: 'calc(100% - 37px)' }}>
                <div className="px-3 py-1.5 pb-0 h-full flex flex-col">
                    <div className="flex justify-between items-center grid grid-flow-col grid-cols-4 text-sm text-secondary pb-1.5 gap-2">
                        <ListHeader>{i18n._(t`Network`)}</ListHeader>
                        <ListHeader className="justify-end">
                            {i18n._(t`Size`)} <strong>ETH</strong>
                        </ListHeader>
                        <ListHeader className="justify-end">
                            {i18n._(t`Price`)} <strong>USD</strong>
                        </ListHeader>
                        <ListHeader className="justify-end">{i18n._(t`Time`)}</ListHeader>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {messageHistory.current.map(({ chainId, amountBase, side, timestamp, price, txHash }) => {
                            const buy = side === OrderDirection.BUY
                            return (
                                <div key={txHash}>
                                    <div className="grid grid-flow-col grid-cols-4 text-sm gap-2">
                                        <div className="text-xs text-secondary">{NETWORK_LABEL[chainId]}</div>
                                        <div
                                            className={`text-right text-xs font-mono ${
                                                buy ? 'text-green' : 'text-red'
                                            }`}
                                        >
                                            {formattedNum(amountBase)}
                                        </div>
                                        <div className="text-right text-xs font-mono">{formattedNum(price)}</div>
                                        <div className="text-right text-xs text-secondary font-mono">
                                            {new Date(timestamp).toTimeString().substring(0, 8)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SwapHistory
