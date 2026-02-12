import { Twitter, Linkedin, Coffee } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-[#f4f4f4] text-innoq-gray-75 py-6 border-t border-innoq-gray-25">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm flex items-center gap-3">
                    <span>&copy; {new Date().getFullYear()} Tom Abai</span>
                    <span className="text-innoq-gray-25">|</span>
                    <a
                        href="https://ko-fi.com/tomizlatan65950"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-innoq-petrol hover:text-innoq-petrol-75 transition-colors"
                    >
                        <Coffee className="w-4 h-4" />
                        Buy me a coffee
                    </a>
                    <span className="text-innoq-gray-25">|</span>
                    <Link href="/terms" className="hover:text-innoq-petrol transition-colors">
                        Terms & API Usage
                    </Link>
                </div>

                {/* Community Message */}
                <div className="text-sm text-innoq-gray-50">
                    Made with ❤️ for the AI & security community
                </div>

                <div className="flex gap-4">
                    <a
                        href="https://x.com/abai_tom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-innoq-petrol transition-colors"
                    >
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/tom-abai-a4862915a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-innoq-petrol transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    )
}
