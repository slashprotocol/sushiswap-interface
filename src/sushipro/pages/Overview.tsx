import React, { FC, useEffect } from 'react'
import Swap from '../../pages/Swap'
import Helmet from 'react-helmet'
import PositionTable from '../components/PositionTable'
import TVChartContainer from '../components/TVChartContainer'
import TabCard from '../components/TabCard'
import SwapHistory from '../components/SwapHistory'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ChainId } from '@sushiswap/sdk'
import { Field, selectCurrency } from '../../state/swap/actions'
import { useDispatch } from 'react-redux'

const Overview: FC = () => {
    const { chainId } = useActiveWeb3React()
    const dispatch = useDispatch()
    let address = ''
    switch (chainId) {
        case ChainId.MAINNET:
        case ChainId.GÖRLI:
        case ChainId.KOVAN:
        case ChainId.ROPSTEN:
        case ChainId.RINKEBY:
        default:
            address = '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'
            break
        case ChainId.BSC:
            address = '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4'
            break
        case ChainId.MATIC:
            address = '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a'
            break
    }

    useEffect(() => {
        dispatch(
            selectCurrency({
                field: Field.OUTPUT,
                currencyId: address
            })
        )
    }, [chainId])

    return (
        <>
            <Helmet>
                <title>SushiPro | Sushi</title>
            </Helmet>
            <div className="gap-4 grid grid-flow-row auto-rows-max lg:grid-flow-col lg:grid-rows-12 grid-cols-12 xl:container">
                {/*<div className="row-span-3 col-span-6 border-gray-800">*/}
                {/*    <PairStats />*/}
                {/*</div>*/}
                <div className="lg:row-span-6 col-span-full xl:col-span-4">
                    <Swap />
                </div>
                <div
                    style={{ minHeight: 600 }}
                    className="lg:row-span-4 col-span-full xl:col-span-8 border-gray-800 rounded pr-2 py-1 bg-dark-900"
                >
                    <TVChartContainer />
                </div>
                <div
                    style={{ minHeight: 500, maxHeight: 500 }}
                    className="lg:row-span-2 col-span-full xl:col-span-8 bg-dark-900 rounded"
                >
                    <TabCard
                        titles={['Swap History', 'Positions']}
                        components={[<SwapHistory key={0} />, <PositionTable key={1} />]}
                    />
                </div>
            </div>
        </>
    )
}

export default Overview
