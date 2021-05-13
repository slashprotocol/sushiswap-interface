import React, { FC } from 'react'
import ComponentHeader from '../ComponentHeader'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

const PositionTable: FC = () => {
    const { i18n } = useLingui()

    return (
        <>
            <ComponentHeader title={i18n._(t`Positions`)} />
        </>
    )
}

export default PositionTable
