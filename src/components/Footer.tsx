import { Scale } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">Synth-Law</h3>
              <p className="text-xs text-slate-400">Leveling the Legal Playing Field</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-slate-400">
              Built for the 15 Million Indian Freelancers
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Powered by Gemini 1.5 Pro & Firebase Genkit
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          © 2026 Synth-Law. All rights reserved. | Not a substitute for professional legal advice.
        </div>
      </div>
    </footer>
  )
}
