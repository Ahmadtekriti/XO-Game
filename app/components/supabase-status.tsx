"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function SupabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function checkConnection() {
      try {
        // Try to fetch the count of entries in the leaderboard table
        const { count, error } = await supabase.from("leaderboard").select("*", { count: "exact", head: true })

        if (error) throw error

        setStatus("connected")
      } catch (error) {
        console.error("Supabase connection error:", error)
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : String(error))
      }
    }

    checkConnection()
  }, [])

  if (status === "checking") {
    return <div className="text-sm text-yellow-400">Checking Supabase connection...</div>
  }

  if (status === "error") {
    return <div className="text-sm text-red-400">Supabase connection error: {errorMessage}</div>
  }

  return <div className="text-sm text-green-400">Connected to Supabase</div>
}
