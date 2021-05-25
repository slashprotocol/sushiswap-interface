import React, { FC, useEffect, useRef, useState } from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { PairState, usePair } from '../../../data/Reserves'
import Loader from '../../../components/Loader'
import { useDerivedSwapInfo } from '../../../state/swap/hooks'
import { OrderDirection, UserHistoryMessage } from 'sushipro/entities'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import AsyncTokenIcon from '../../../kashi/components/AsyncTokenIcon'
import { ArrowRight } from 'react-feather'
import { formattedNum, priceFormatter } from '../../../utils'

const PositionTable: FC = () => {
    const { account } = useActiveWeb3React()
    const { currencies } = useDerivedSwapInfo()
    const [pairState, pair] = usePair(currencies.INPUT, currencies.OUTPUT)
    const { i18n } = useLingui()
    const messageHistory = useRef<UserHistoryMessage[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!account) return
        const init = async () => {
            const resp = await fetch(
                `https://api.sushipro.io/?api_key=EatSushiIsGood&act=user_transactions&chainID=1&address=${account?.toLowerCase()}`
            )

            const { results } = await resp.json()
            const history: UserHistoryMessage[] = []
            for (let i = results.length - 1; i >= 0; i--) {
                if (results[i]) {
                    const { chainId, amountBase, amountQuote, price, priceBase, side, timestamp, txHash } = results[i]
                    history.push({
                        chainId,
                        amountBase,
                        amountQuote,
                        price,
                        priceBase,
                        side,
                        timestamp,
                        txHash
                    } as UserHistoryMessage)
                }
            }

            messageHistory.current = history
            setLoading(false)
        }

        init()
    }, [account])

    if (pairState === PairState.LOADING)
        return (
            <div className="h-full flex justify-center items-center">
                <Loader />
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
            <div className="overflow-y-scroll border-dark-850">
                <div className="flex flex-col-reverse justify-end pb-2">
                    {loading ? (
                        <div className="flex justify-between items-center">
                            <Loader />
                        </div>
                    ) : (
                        messageHistory.current.map(
                            (
                                { chainId, amountBase, amountQuote, side, timestamp, price, priceBase, txHash },
                                index
                            ) => {
                                const buy = side === OrderDirection.BUY
                                return (
                                    <div
                                        key={`${index}`}
                                        className="grid grid-cols-2 items-center justify-start gap-4 py-2"
                                    >
                                        <div className="">
                                            {new Date(timestamp * 1000)
                                                .toLocaleString()
                                                .split(' ')
                                                .map(el => (
                                                    <>
                                                        {el}
                                                        <br />
                                                    </>
                                                ))}
                                        </div>
                                        <div className="grid grid-cols-3 items-center">
                                            <div className="flex justify-start items-center gap-3">
                                                <AsyncTokenIcon
                                                    className="rounded h-10 w-10"
                                                    address="0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
                                                    chainId={chainId}
                                                />
                                                <div className="grid grid-cols-1">
                                                    <div>{formattedNum(amountBase, true)}</div>
                                                    <div className="text-secondary text-sm">
                                                        {priceFormatter.format(+price)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-center">
                                                <ArrowRight />
                                            </div>
                                            <div className="flex justify-start items-center gap-3">
                                                <AsyncTokenIcon
                                                    className="rounded h-10 w-10"
                                                    address="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                                                    chainId={chainId}
                                                />
                                                <div className="grid grid-cols-1">
                                                    <div>{formattedNum(amountBase, true)}</div>
                                                    <div className="text-secondary text-sm">
                                                        {priceFormatter.format(+priceBase)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default PositionTable
