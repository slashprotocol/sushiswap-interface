import React, { FC } from 'react'

interface ComponentHeaderProps {
    title: string | JSX.Element
    subtitle?: string | JSX.Element
}

const ComponentHeader: FC<ComponentHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="px-3 h-12">
            <div className="flex items-center text-sm w-full py-2 h-full border-b border-gray-800">{title}</div>
        </div>
    )
}

export default ComponentHeader
