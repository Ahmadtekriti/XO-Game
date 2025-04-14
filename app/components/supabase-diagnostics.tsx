"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"

interface SupabaseDiagnosticsProps {
  onClose: () => void
}

export default function SupabaseDiagnostics({ onClose }: SupabaseDiagnosticsProps) {
  const [results, setResults] = useState<
    Array<{ step: string; status: "success" | "error" | "pending"; message: string }>
  >([])
  const [isRunning, setIsRunning] = useState(false)
  const [showDetails, setShowDetails] = useState(true) // Default to showing details
  const [availableColumns, setAvailableColumns] = useState<string[]>([])

  const addResult = (step: string, status: "success" | "error" | "pending", message: string) => {
    setResults((prev) => [...prev, { step, status, message }])
  }

  const runTests = async () => {
    setResults([])
    setIsRunning(true)

    // Step 1: Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      addResult("Environment Variables", "error", "NEXT_PUBLIC_SUPABASE_URL is missing")
    } else {
      addResult(
        "Environment Variables (URL)",
        "success",
        `NEXT_PUBLIC_SUPABASE_URL is set: ${supabaseUrl.substring(0, 10)}...`,
      )
    }

    if (!supabaseAnonKey) {
      addResult("Environment Variables", "error", "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing")
    } else {
      addResult(
        "Environment Variables (Key)",
        "success",
        `NEXT_PUBLIC_SUPABASE_ANON_KEY is set: ${supabaseAnonKey.substring(0, 5)}...`,
      )
    }

    // Step 2: Test Supabase connection
    try {
      addResult("Supabase Connection", "pending", "Testing connection to Supabase...")
      const { data, error } = await supabase.from("leaderboard").select("count", { count: "exact", head: true })

      if (error) {
        addResult("Supabase Connection", "error", `Connection failed: ${error.message}`)
      } else {
        addResult("Supabase Connection", "success", "Successfully connected to Supabase")
      }
    } catch (err) {
      addResult(
        "Supabase Connection",
        "error",
        `Connection exception: ${err instanceof Error ? err.message : String(err)}`,
      )
    }

    // Step 3: Check table schema
    try {
      addResult("Table Schema", "pending", "Checking leaderboard table schema...")

      // This is a workaround to get table schema since Supabase doesn't have a direct API for it
      const { data, error } = await supabase.from("leaderboard").select("*").limit(1)

      if (error) {
        addResult("Table Schema", "error", `Failed to check schema: ${error.message}`)
      } else {
        if (data && data.length > 0) {
          const columns = Object.keys(data[0])
          setAvailableColumns(columns)
          addResult("Table Schema", "success", `Table columns: ${columns.join(", ")}`)

          // Check specifically for time-related columns
          const timeColumns = columns.filter((col) => col.includes("time") || col.includes("Time"))

          if (timeColumns.length > 0) {
            addResult("Time Column", "success", `Found time-related columns: ${timeColumns.join(", ")}`)
          } else {
            addResult("Time Column", "error", "No time-related columns found in the schema")
          }
        } else {
          addResult("Table Schema", "pending", "No records found. Will try to insert a test record to check schema...")
        }
      }
    } catch (err) {
      addResult("Table Schema", "error", `Schema check exception: ${err instanceof Error ? err.message : String(err)}`)
    }

    // Step 4: Test basic insert without time field
    try {
      addResult("Basic Insert", "pending", "Attempting to insert basic record without time field...")

      const basicData = {
        name: "Test User " + Math.floor(Math.random() * 1000),
        wins: 1,
        losses: 0,
        ties: 0,
        score: 100,
        mode: "ai",
      }

      const { data, error } = await supabase.from("leaderboard").insert([basicData]).select()

      if (error) {
        addResult("Basic Insert", "error", `Basic insert failed: ${error.message}`)
      } else {
        addResult("Basic Insert", "success", "Basic insert successful!")

        // If we have available columns, try to insert with the correct time field
        if (availableColumns.length > 0) {
          const timeColumn = availableColumns.find((col) => col.includes("time") || col.includes("Time"))

          if (timeColumn) {
            addResult("Time Field Insert", "pending", `Attempting insert with '${timeColumn}' field...`)

            const timeData = {
              name: "Test User " + Math.floor(Math.random() * 1000),
              wins: 1,
              losses: 0,
              ties: 0,
              score: 100,
              mode: "ai",
              [timeColumn]: 60000, // Use the detected time column
            }

            const timeResult = await supabase.from("leaderboard").insert([timeData]).select()

            if (timeResult.error) {
              addResult("Time Field Insert", "error", `Insert with '${timeColumn}' failed: ${timeResult.error.message}`)
            } else {
              addResult(
                "Time Field Insert",
                "success",
                `Insert with '${timeColumn}' successful! Use this column name in your code.`,
              )
            }
          }
        }
      }
    } catch (err) {
      addResult("Basic Insert", "error", `Insert exception: ${err instanceof Error ? err.message : String(err)}`)
    }

    // Step 5: Test fetch
    try {
      addResult("Test Fetch", "pending", "Attempting to fetch leaderboard data...")

      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
        .limit(5)

      if (error) {
        addResult("Test Fetch", "error", `Fetch failed: ${error.message}`)
      } else {
        addResult("Test Fetch", "success", `Successfully fetched ${data.length} records`)

        if (data.length > 0) {
          // Log the first record to see its structure
          addResult("Sample Record", "success", `Sample record: ${JSON.stringify(data[0])}`)
        }
      }
    } catch (err) {
      addResult("Test Fetch", "error", `Fetch exception: ${err instanceof Error ? err.message : String(err)}`)
    }

    setIsRunning(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-auto p-4">
      <div className="max-w-2xl mx-auto bg-[#16213e] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Supabase Diagnostics</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-[#4ecdc4] text-[#16213e] px-4 py-2 rounded-md font-medium hover:bg-[#3dbdb5] transition-colors disabled:opacity-50"
          >
            {isRunning ? "Running Tests..." : "Run Diagnostics"}
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="ml-2 bg-[#16213e] border border-[#4ecdc4] text-[#4ecdc4] px-4 py-2 rounded-md font-medium hover:bg-[#1e2a4a] transition-colors"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                result.status === "success"
                  ? "bg-green-900 bg-opacity-20 border border-green-500 border-opacity-30"
                  : result.status === "error"
                    ? "bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30"
                    : "bg-yellow-900 bg-opacity-20 border border-yellow-500 border-opacity-30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      result.status === "success"
                        ? "bg-green-500"
                        : result.status === "error"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  ></span>
                  <span className="font-medium">{result.step}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    result.status === "success"
                      ? "bg-green-500 bg-opacity-20 text-green-300"
                      : result.status === "error"
                        ? "bg-red-500 bg-opacity-20 text-red-300"
                        : "bg-yellow-500 bg-opacity-20 text-yellow-300"
                  }`}
                >
                  {result.status.toUpperCase()}
                </span>
              </div>

              {showDetails && (
                <div className="mt-2 text-sm text-gray-300 bg-black bg-opacity-30 p-2 rounded overflow-auto max-h-32">
                  {result.message}
                </div>
              )}
            </div>
          ))}

          {results.length === 0 && !isRunning && (
            <div className="text-center text-gray-400 py-8">
              Click "Run Diagnostics" to start testing your Supabase connection
            </div>
          )}

          {isRunning && <div className="text-center text-gray-400 py-4">Running tests...</div>}
        </div>
      </div>
    </div>
  )
}
