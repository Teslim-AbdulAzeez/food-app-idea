"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

interface MobileNavProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export function MobileNav({ tabs, activeTab, onTabChange, onLogout }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-primary-foreground p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 md:hidden bg-primary/95 backdrop-blur border-t border-primary/20 z-40">
          <div className="px-4 py-4 flex flex-col gap-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  onTabChange(tab)
                  setIsOpen(false)
                }}
                className={`text-left py-2 px-3 rounded capitalize font-medium transition ${
                  activeTab === tab
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="border-t border-primary-foreground/20 pt-4 mt-4">
              <button
                onClick={() => {
                  onLogout()
                  setIsOpen(false)
                }}
                className="w-full py-2 px-3 rounded text-primary-foreground hover:bg-primary-foreground/10 transition text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
