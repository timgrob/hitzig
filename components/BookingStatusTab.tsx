'use client'
import { Divide } from 'lucide-react'
import { useState } from 'react'

type Tab = 'active' | 'canceled'

export function BookingStatusTabs() {
    const [tab, setTab] = useState<Tab>('active')

    return (
        <div>
            <div className="flex gap-1 border-b border-zinc-200 mb-6">
                {(['active', 'canceled'] as Tab[]).map((key) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px
              ${tab === key
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-800'
                            }`}
                    >
                        {key}
                    </button>
                ))}
            </div>
            {tab === 'active'}
            {tab === 'canceled'}
        </div>
    )
}