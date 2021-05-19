import React, { FC } from 'react'
import { useDerivedSwapInfo } from '../../../state/swap/hooks'
import { PairState, usePair } from '../../../data/Reserves'
import Loader from '../../../components/Loader'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const TVChartContainer: FC = () => {
    const { currencies } = useDerivedSwapInfo()
    const [pairState, pair] = usePair(currencies.INPUT, currencies.OUTPUT)
    const { i18n } = useLingui()

    if (pairState === PairState.LOADING)
        return (
            <div className="flex flex-col justify-between items-center">
                <Loader />
            </div>
        )

    if (pairState === PairState.NOT_EXISTS)
        return (
            <div className="flex flex-col justify-between items-center">
                <div className="text-secondary text-sm">{i18n._(t`Pair does not exist`)}</div>
            </div>
        )

    if (pairState === PairState.INVALID)
        return (
            <div className="flex flex-col justify-between items-center">
                <div className="text-secondary text-sm">{i18n._(t`Please select a token`)}</div>
            </div>
        )

    // TODO
    return (
        <iframe
            src={`http://localhost:5000?symbol=${pair?.token0.symbol}${pair?.token1.symbol}`}
            width="100%"
            height="100%"
        />
    )
}

export default TVChartContainer
