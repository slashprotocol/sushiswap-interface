import React, { FC } from 'react'
import Swap from '../../pages/Swap'
import SwapTable from '../components/SwapHistory'
import Helmet from 'react-helmet'
import PositionTable from '../components/PositionTable'
import PairStats from '../components/PairStats'
import TVChartContainer from '../components/TVChartContainer'

const Overview: FC = () => {
    return (
        <>
            <Helmet>
                <title>SushiPro | Sushi</title>
            </Helmet>
            <div className="grid grid-flow-col grid-rows-6 grid-cols-12 w-full h-full divide-x divide-y bg-dark-900">
                <div className="row-span-3 col-span-2 border-gray-800">
                    <PairStats />
                </div>
                <div className="row-span-3 col-span-2 border-gray-800">
                    <Swap />
                </div>
                <div className="row-span-6 col-span-3 border-gray-800 flex flex-col">
                    <SwapTable />
                </div>
                <div className="row-span-4 col-span-9 border-gray-800">
                    <div className="p-4 h-full w-full">
                        <TVChartContainer />
                    </div>
                </div>
                <div className="row-span-2 col-span-10 border-gray-800">
                    <PositionTable />
                </div>
            </div>
        </>
    )
}

export default Overview
