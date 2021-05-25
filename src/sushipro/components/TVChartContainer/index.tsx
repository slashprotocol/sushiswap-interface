import React, { FC, useState } from 'react'
import { useDerivedSwapInfo } from '../../../state/swap/hooks'
import { PairState, usePair } from '../../../data/Reserves'
import Loader from '../../../components/Loader'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const TVChartContainer: FC = () => {
    const { currencies } = useDerivedSwapInfo()
    const [pairState, pair] = usePair(currencies.INPUT, currencies.OUTPUT)
    const { i18n } = useLingui()
    const [loading, setLoading] = useState(false)

    if (pairState === PairState.LOADING || loading)
        return (
            <div className="h-full flex justify-center items-center">
                <Loader size="24px" />
            </div>
        )

    if (pairState === PairState.NOT_EXISTS)
        return (
            <div className="h-full flex justify-center items-center">
                <div className="text-secondary text-sm">{i18n._(t`Pair does not exist`)}</div>
            </div>
        )

    if (pairState === PairState.INVALID)
        return (
            <div className="h-full flex justify-center items-center">
                <div className="text-secondary text-sm">{i18n._(t`Please select a token`)}</div>
            </div>
        )

    // TODO URL
    return (
        <iframe
            src={`http://localhost:5000?symbol=${pair?.token0.symbol}${pair?.token1.symbol}`}
            width="100%"
            height="100%"
            onLoad={() => setLoading(false)}
        />
    )
}

export default TVChartContainer
