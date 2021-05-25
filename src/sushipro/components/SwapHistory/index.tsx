import React, { useCallback, useEffect, useRef, FC, useState, useLayoutEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { t } from '@lingui/macro'
import ListHeader from '../ListHeader'
import { useLingui } from '@lingui/react'
import { formattedNum, priceFormatter } from '../../../utils'
import { useDerivedSwapInfo } from '../../../state/swap/hooks'
import { NETWORK_LABEL } from '../../../constants/networks'
import { PairState, usePair } from '../../../data/Reserves'
import Loader from '../../../components/Loader'
import { OrderDirection, SwapMessage } from '../../entities'

const SwapHistory: FC = () => {
    const { currencies } = useDerivedSwapInfo()
    const [pairState, pair] = usePair(currencies.INPUT, currencies.OUTPUT)
    const { i18n } = useLingui()
    const { sendMessage, lastMessage } = useWebSocket('wss://ws-eu.pusher.com/app/068f5f33d82a69845215')
    const messageHistory = useRef<SwapMessage[]>([])
    const [loading, setLoading] = useState(true)

    const parseMessage = useCallback(
        async (message: MessageEvent) => {
            if (!pair?.liquidityToken.address) return

            try {
                const msg = JSON.parse(message.data)
                if ('data' in msg) {
                    const parsedData = JSON.parse(msg.data)
                    if (parsedData && parsedData.result && parsedData.result.status === 'ok') {
                        const { chainId, pair: parsedPair } = parsedData.result.data
                        if (parsedPair.toLowerCase() === pair.liquidityToken.address.toLowerCase())
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
        },
        [pair?.liquidityToken.address]
    )

    useLayoutEffect(() => {
        if (!pair?.liquidityToken.address) return
        if (!loading) setLoading(true)

        const populate = async () => {
            const resp = await fetch(
                `https://api.sushipro.io/?api_key=EatSushiIsGood&act=last_transactions&chainID=1&pair=${pair?.liquidityToken.address.toLowerCase()}`
            )

            const { results } = await resp.json()
            const history: SwapMessage[] = []
            for (let i = results.length - 1; i >= 0; i--) {
                if (results[i]) {
                    const { chainId, amountBase, price, side, timestamp, txHash } = results[i]
                    history.push({ chainId, amountBase, price, side, timestamp, txHash } as SwapMessage)
                }
            }

            messageHistory.current = history
            setLoading(false)
        }

        populate()
    }, [pair?.liquidityToken.address])

    useEffect(() => {
        sendMessage(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: 'live_transactions' } }))
    }, [])

    useEffect(() => {
        if (!lastMessage) return

        parseMessage(lastMessage)
    }, [lastMessage, parseMessage])

    if (pairState === PairState.LOADING || loading)
        return (
            <div className="h-full flex justify-center items-center">
                <Loader size="24px" />
            </div>
        )

    if (pairState === PairState.NOT_EXISTS)
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-secondary text-sm">{i18n._(t`Pair does not exist`)}</span>
            </div>
        )

    if (pairState === PairState.INVALID)
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-secondary text-sm">{i18n._(t`Please select a token`)}</span>
            </div>
        )

    return (
        <div className="w-full flex flex-col divide-y h-full">
            <div className="flex justify-between items-center grid grid-flow-col grid-cols-5 text-secondary pb-1.5 gap-2 border-dark-850">
                <ListHeader>{i18n._(t`Network`)}</ListHeader>
                <ListHeader>{i18n._(t`Symbol`)}</ListHeader>
                <ListHeader className="justify-end">
                    {i18n._(t`Price`)} <strong>USD</strong>
                </ListHeader>
                <ListHeader className="justify-end">
                    {i18n._(t`Size`)} <strong>{pair?.token0.symbol}</strong>
                </ListHeader>
                <ListHeader className="justify-end">{i18n._(t`Time`)}</ListHeader>
            </div>
            <div className="overflow-y-scroll border-dark-850">
                <div className="flex flex-col-reverse justify-end pb-2 divide-y">
                    {messageHistory.current.map(({ chainId, amountBase, side, timestamp, price, txHash }, index) => {
                        const buy = side === OrderDirection.BUY
                        return (
                            <div key={`${index}`} className="border-dark-850 relative">
                                <div className="grid grid-flow-col grid-cols-5 text-sm gap-2 py-1">
                                    <div className="text-xs text-secondary">{NETWORK_LABEL[chainId]}</div>
                                    <div className="text-xs text-secondary">{`${pair?.token0.symbol}/${pair?.token1.symbol}`}</div>
                                    <div className={`text-right text-xs ${buy ? 'text-green' : 'text-red'} font-mono`}>
                                        {priceFormatter.format(price)}
                                    </div>
                                    <div className="text-right text-xs font-mono">{formattedNum(amountBase)}</div>
                                    <div className="text-right text-xs text-secondary font-mono">
                                        {new Date(timestamp * 1000).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SwapHistory
