import React, { FC } from 'react'
import { useLingui } from '@lingui/react'
import usePrevious from '../../hooks/usePrevious'
import { formattedNum } from '../../utils'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import ComponentHeader from './ComponentHeader'
import { PairState, usePair } from '../../data/Reserves'

const PairStats: FC = () => {
    const { currencies } = useDerivedSwapInfo()
    const { i18n } = useLingui()
    const [pairState, pair] = usePair(currencies.INPUT, currencies.OUTPUT)

    const price = pair?.token0Price.toFixed() || 0
    const lastPrice = usePrevious(price)
    const priceUp = lastPrice && price > lastPrice

    if (pairState !== PairState.EXISTS) return <div>Pair does not exist</div>

    return (
        <>
            <ComponentHeader
                title={
                    <div className="flex items-center gap-3">
                        <DoubleCurrencyLogo currency0={currencies.INPUT} currency1={currencies.OUTPUT} size={24} />
                        <span className="font-bold">
                            {currencies.INPUT?.symbol} -{' '}
                            <span className="text-secondary">{currencies.OUTPUT?.symbol}</span>
                        </span>
                    </div>
                }
            />
            <div className="grid grid-flow-row gap-3 p-3">
                <div className="row py-0.5">
                    <span className={`flex items-baseline text-h5 font-mono ${priceUp ? 'text-green' : 'text-red'}`}>
                        {formattedNum(pair?.token0Price.toFixed(), true)}
                        <span className="text-sm text-red">&nbsp;-5.34%</span>
                    </span>
                </div>
                <div className="row py-0.5">
                    <div className="text-xs">Pooled {currencies.INPUT?.symbol}</div>
                    <div className="text-h6 font-mono">{formattedNum(pair?.reserve0.toFixed())}</div>
                </div>
                <div className="row py-0.5">
                    <div className="text-xs">Pooled {currencies.OUTPUT?.symbol}</div>
                    <div className="text-h6 font-mono">{formattedNum(pair?.reserve1.toFixed())}</div>
                </div>
                <div className="row py-0.5">
                    <div className="text-xs">Total Tx</div>
                    <div className="text-h6">123456</div>
                </div>
                <div className="row py-0.5">
                    <div className="text-xs">Holders</div>
                    <div className="text-h6">123456</div>
                </div>
            </div>
        </>
    )
}

export default PairStats
