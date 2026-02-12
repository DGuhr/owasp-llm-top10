'use client'

import React from 'react'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import { LabLayout } from '@/components/LabLayout'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'

const ACCENT_COLOR = '#ef4444' // Red for Security Layer

interface VulnerabilityCardProps {
    id: string
    title: string
    description: string
    color: string
    path: string
}

export default function SecurityLayerPage() {
    // Security Layer related vulnerabilities
    const vulnerabilities = [
        {
            id: 'LLM07',
            title: 'System Prompt Leakage',
            description: 'The system prompt leakage vulnerability in LLMs refers to the risk that the system prompts or instructions used to steer the behavior of the model can also contain sensitive information that was not intended to be discovered.',
            color: '#ef4444',
            path: '/labs/system-prompt-leakage'
        }
    ]

    return (
        <LabLayout>
            <div className="text-innoq-gray p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <LabHeader
                        labNumber="SECURITY"
                        title="Security Layer Component"
                        description="The Security Layer provides protective measures and controls to safeguard the LLM system against various threats and vulnerabilities, including prompt injection, unauthorized access, and data leakage."
                        icon={Shield}
                        accentColor={ACCENT_COLOR}
                    />

                    {/* Component Description */}
                    <TerminalSection title="Component Overview" accentColor={ACCENT_COLOR}>
                        <div className="space-y-4 text-innoq-gray-75">
                            <p>
                                The Security Layer encompasses various mechanisms to protect the LLM system,
                                including input validation, sanitization, output filtering, access controls,
                                rate limiting, and monitoring. It serves as a critical barrier against
                                malicious attempts to exploit the system.
                            </p>
                            <p>
                                A key vulnerability in this component is System Prompt Leakage, where the
                                instructions and constraints designed to control the model&apos;s behavior may
                                be exposed through careful manipulation, potentially revealing sensitive
                                information or allowing attackers to bypass security controls.
                            </p>
                        </div>
                    </TerminalSection>

                    {/* Vulnerabilities Section */}
                    <TerminalSection title="Related Vulnerabilities" accentColor={ACCENT_COLOR}>
                        <div className="grid grid-cols-1 gap-6">
                            {vulnerabilities.map(vuln => (
                                <VulnerabilityCard
                                    key={vuln.id}
                                    id={vuln.id}
                                    title={vuln.title}
                                    description={vuln.description}
                                    color={vuln.color}
                                    path={vuln.path}
                                />
                            ))}
                        </div>
                    </TerminalSection>
                </div>
            </div>
        </LabLayout>
    )
}

function VulnerabilityCard({ id, title, description, color, path }: VulnerabilityCardProps) {
    return (
        <Link href={path} className="block group">
            <div
                className="bg-[#f7f7f7] border-2 rounded-lg overflow-hidden transition-all hover:scale-[1.02] cursor-pointer h-full flex flex-col"
                style={{ 
                    borderColor: `${color}33`,
                    boxShadow: `0 0 20px ${color}1a`
                }}
            >
                <div className="p-6 flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="text-sm font-bold font-mono px-2 py-1 rounded"
                            style={{ backgroundColor: `${color}20`, color }}
                        >
                            {id}
                        </div>
                        <h3 className="text-lg font-semibold font-mono text-innoq-gray">{title}</h3>
                    </div>
                    <p className="text-innoq-gray-75 text-sm line-clamp-3">{description}</p>
                </div>
                <div className="px-6 py-3 bg-white border-t flex justify-between items-center" style={{ borderColor: `${color}33` }}>
                    <span className="text-sm font-mono text-innoq-gray-75">Go to lab</span>
                    <span className="text-sm font-mono group-hover:translate-x-1 transition-transform inline-block" style={{ color }}>→</span>
                </div>
            </div>
        </Link>
    )
} 