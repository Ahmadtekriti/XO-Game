"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import SupabaseDiagnostics from "./supabase-diagnostics"

export default function TestInsert() {
  const [status, setStatus] = useState<string>("")
  const [showDiagnostics, setShowDiagnostics] = useState(false)

  const handleTestInsert = async () => {
    try {
      setStatus("Attempting to insert test record...")

      // First, let's check the table structure to see what columns actually exist
      const { data: schemaData, error: schemaError } = await supabase.from("leaderboard").select("*").limit(1)

      if (schemaError) {
        setStatus(`Schema check error: ${schemaError.message}`)
        return
      }

      // If we have data, log the column names
      if (schemaData && schemaData.length > 0) {
        const columns = Object.keys(schemaData[0])
        console.log("Available columns:", columns)
        setStatus(`Available columns: ${columns.join(", ")}`)
      } else {
        console.log("No data found to determine schema")
      }

      // Create a test record with only basic fields that should exist
      const testData = {
        name: "Test User " + Math.floor(Math.random() * 1000),
        wins: 1,
        losses: 0,
        ties: 0,
        score: 100,
        mode: "ai",
      }

      // Try to insert without the time field first
      const { data, error } = await supabase.from("leaderboard").insert([testData]).select()

      if (error) {
        console.error("Basic insert error:", error)
        setStatus(`Basic insert error: ${error.message}`)
        return
      }

      console.log("Basic insert successful:", data)
      setStatus("Basic insert successful! Check console for column names.")
    } catch (err) {
      console.error("Test insert exception:", err)
      setStatus(`Exception: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <button
          onClick={handleTestInsert}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Test DB Insert
        </button>

        <button
          onClick={() => setShowDiagnostics(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Run Diagnostics
        </button>

        {status && (
          <div className="mt-2 p-2 bg-black bg-opacity-70 rounded text-xs text-white max-w-xs overflow-auto">
            {status}
          </div>
        )}
      </div>

      {showDiagnostics && <SupabaseDiagnostics onClose={() => setShowDiagnostics(false)} />}
    </>
  )
}
