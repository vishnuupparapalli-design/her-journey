import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

function JourneyHome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-6">
        <span className="text-amber-glow text-sm tracking-wide font-sans">
          Stage 1 · Foundation Online
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-moonlight leading-tight">
          A Universe For Her
        </h1>
        <p className="text-moonlight/70 text-base md:text-lg font-light leading-relaxed">
          The foundation is set. Next, we will build the question engine, wire up Supabase for permanent storage, and craft the 14 worlds.
        </p>
        <div className="pt-4">
          <Link
            to="/admin"
            className="inline-block px-5 py-2.5 rounded-full border border-moonlight/20 text-moonlight/60 hover:text-moonlight hover:border-moonlight/40 transition-colors text-sm"
          >
            Go to Admin Check
          </Link>
        </div>
      </div>
    </main>
  )
}

function AdminCheck() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-nebula/40">
      <div className="max-w-md p-8 rounded-2xl border border-moonlight/10 bg-void/80 space-y-4">
        <h2 className="text-2xl font-serif text-moonlight">Admin Route Preview</h2>
        <p className="text-moonlight/60 text-sm">
          HashRouter is functional. When we reach Stage 11, your private, protected dashboard will live here.
        </p>
        <Link
          to="/"
          className="inline-block text-amber-glow hover:underline text-sm pt-2"
        >
          ← Return to Journey
        </Link>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-void text-moonlight">
      <Routes>
        <Route path="/" element={<JourneyHome />} />
        <Route path="/admin" element={<AdminCheck />} />
      </Routes>
    </div>
  )
}