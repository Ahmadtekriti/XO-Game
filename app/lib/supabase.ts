import { createClient } from "@supabase/supabase-js"

// These environment variables are automatically available after adding the Supabase integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Enhanced logging for debugging
console.log("Supabase URL:", supabaseUrl ? "Available" : "Missing")
console.log("Supabase Anon Key:", supabaseAnonKey ? "Available" : "Missing")

// Local storage key for offline data
const OFFLINE_LEADERBOARD_KEY = "xo_game_offline_leaderboard"

// Validate the environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env.local file.")
}

// Create a single supabase client for the entire app with better error handling
let supabase: ReturnType<typeof createClient>

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Don't persist the session to avoid issues in development
    },
  })
  console.log("Supabase client initialized successfully")
} catch (error) {
  console.error("Error initializing Supabase client:", error)
  // Create a fallback client that will return empty data but not crash
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          then: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
      }),
      update: () => ({
        eq: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  } as any
}

export { supabase }

// Define the type for our leaderboard entries
// We'll keep the type flexible until we determine the exact column names
export type LeaderboardEntry = {
  id?: string
  name: string
  wins: number
  losses: number
  ties: number
  score: number
  // Make all time-related fields optional until we determine the correct one
  best_time?: number
  bestTime?: number
  time?: number
  best_score_time?: number
  mode: "ai" | "friend"
  created_at?: string
  updated_at?: string
  [key: string]: any // Allow any other fields that might exist
}

// Helper function to get offline leaderboard data
function getOfflineLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return []

  try {
    const offlineData = localStorage.getItem(OFFLINE_LEADERBOARD_KEY)
    if (offlineData) {
      return JSON.parse(offlineData)
    }
  } catch (err) {
    console.error("Error reading offline leaderboard:", err)
  }
  return []
}

// Helper function to save offline leaderboard data
function saveOfflineLeaderboard(entries: LeaderboardEntry[]) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(OFFLINE_LEADERBOARD_KEY, JSON.stringify(entries))
  } catch (err) {
    console.error("Error saving offline leaderboard:", err)
  }
}

// Function to fetch all leaderboard entries with improved error handling
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  console.log("Fetching leaderboard data...")

  try {
    // Add a timeout to the fetch operation
    const fetchPromise = supabase.from("leaderboard").select("*").order("score", { ascending: false })

    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error("Fetch timeout after 5000ms")), 5000),
    )

    // Race between the actual fetch and the timeout
    const result = await Promise.race([fetchPromise, timeoutPromise])

    const { data, error } = result as any

    if (error) {
      console.error("Error fetching leaderboard:", error)
      // Return offline data as fallback
      const offlineData = getOfflineLeaderboard()
      console.log("Using offline leaderboard data:", offlineData.length, "entries")
      return offlineData
    }

    // Log the first entry to see what columns actually exist
    if (data && data.length > 0) {
      console.log("Sample leaderboard entry:", data[0])
      console.log("Available columns:", Object.keys(data[0]))

      // Save to offline storage for future use
      saveOfflineLeaderboard(data)
    } else {
      console.log("No leaderboard entries found")
    }

    return data || []
  } catch (err) {
    console.error("Exception in fetchLeaderboard:", err)
    // Return offline data as fallback
    const offlineData = getOfflineLeaderboard()
    console.log("Using offline leaderboard data due to error:", offlineData.length, "entries")
    return offlineData
  }
}

// Update the saveLeaderboardEntry function to ensure time fields are properly handled
export async function saveLeaderboardEntry(entry: LeaderboardEntry): Promise<LeaderboardEntry | null> {
  console.log("Attempting to save leaderboard entry:", entry)

  try {
    // First, get the table structure to see what columns actually exist
    let availableColumns: string[] = []

    try {
      const { data: schemaData, error: schemaError } = await supabase.from("leaderboard").select("*").limit(1)

      if (schemaError) {
        console.error("Schema check error:", schemaError)
        // Continue with default columns
      } else if (schemaData && schemaData.length > 0) {
        availableColumns = Object.keys(schemaData[0])
        console.log("Available columns in leaderboard table:", availableColumns)
      } else {
        console.log("No existing data found. Will try to create entry with basic columns.")
      }
    } catch (schemaErr) {
      console.error("Error checking schema:", schemaErr)
      // Continue with default columns
    }

    // If we couldn't get columns, use these defaults
    if (availableColumns.length === 0) {
      availableColumns = ["name", "wins", "losses", "ties", "score", "mode", "time", "best_time"]
    }

    // Check if the player already exists
    let existingEntry: LeaderboardEntry | null = null

    try {
      const { data: existingEntries, error: fetchError } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("name", entry.name)
        .eq("mode", entry.mode)
        .limit(1)

      if (fetchError) {
        console.error("Error checking for existing entry:", fetchError)
        // Try to find in offline data
        const offlineData = getOfflineLeaderboard()
        existingEntry = offlineData.find((e) => e.name === entry.name && e.mode === entry.mode) || null
      } else if (existingEntries && existingEntries.length > 0) {
        existingEntry = existingEntries[0]
        console.log("Existing entry found:", existingEntry)
      }
    } catch (fetchErr) {
      console.error("Error fetching existing entry:", fetchErr)
      // Try to find in offline data
      const offlineData = getOfflineLeaderboard()
      existingEntry = offlineData.find((e) => e.name === entry.name && e.mode === entry.mode) || null
    }

    // Prepare data to save based on available columns
    const dataToSave: Record<string, any> = {}

    // Only include fields that exist in the table
    Object.keys(entry).forEach((key) => {
      if (availableColumns.includes(key)) {
        dataToSave[key] = entry[key]
      }
    })

    // Always include these essential fields
    dataToSave.name = entry.name
    dataToSave.wins = entry.wins
    dataToSave.losses = entry.losses
    dataToSave.ties = entry.ties
    dataToSave.score = entry.score
    dataToSave.mode = entry.mode

    // Try to find a time column that exists in the schema
    // Get time value from entry, ensuring it's a number
    const timeValue = entry.best_time || entry.bestTime || entry.time || entry.best_score_time || 0
    console.log("Time value to save:", timeValue, "Type:", typeof timeValue)

    // Try each possible time column name
    const possibleTimeColumns = ["best_time", "bestTime", "time", "best_score_time"]
    let timeColumnFound = false

    for (const columnName of possibleTimeColumns) {
      if (availableColumns.includes(columnName)) {
        console.log(`Using '${columnName}' column for time data:`, timeValue)

        // Make sure we're saving a number, not a string
        const timeValueNumber = typeof timeValue === "string" ? Number.parseFloat(timeValue) : timeValue
        dataToSave[columnName] = timeValueNumber

        timeColumnFound = true
        // Don't break here - save to all available time columns for redundancy
      }
    }

    if (!timeColumnFound) {
      console.log("No time column found in schema. Available columns:", availableColumns)
      // Try to add time to a generic column if none exists
      if (availableColumns.includes("time_seconds")) {
        dataToSave.time_seconds = typeof entry.time === "number" ? entry.time : 0
      } else if (availableColumns.includes("time")) {
        dataToSave.time = typeof entry.time === "number" ? entry.time : 0
      }
    }

    console.log("Data to save:", dataToSave)

    // Update offline data first as a backup
    const offlineData = getOfflineLeaderboard()
    let updatedOfflineData: LeaderboardEntry[]

    if (existingEntry) {
      // Only update if the new score is better
      if (entry.score > existingEntry.score) {
        console.log("Updating existing entry with better score")

        try {
          const { data, error } = await supabase
            .from("leaderboard")
            .update({
              ...dataToSave,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingEntry.id)
            .select()

          if (error) {
            console.error("Error updating leaderboard entry:", error)

            // Update offline data
            updatedOfflineData = offlineData.map((e) => {
              if (e.name === entry.name && e.mode === entry.mode && entry.score > e.score) {
                return { ...e, ...dataToSave, updated_at: new Date().toISOString() }
              }
              return e
            })
            saveOfflineLeaderboard(updatedOfflineData)

            return existingEntry // Return existing entry as fallback
          }

          console.log("Entry updated successfully:", data)

          // Update offline data
          updatedOfflineData = offlineData.map((e) => {
            if (e.name === entry.name && e.mode === entry.mode) {
              return { ...e, ...dataToSave, updated_at: new Date().toISOString() }
            }
            return e
          })
          saveOfflineLeaderboard(updatedOfflineData)

          return data?.[0] || existingEntry
        } catch (updateErr) {
          console.error("Exception during update:", updateErr)

          // Update offline data
          updatedOfflineData = offlineData.map((e) => {
            if (e.name === entry.name && e.mode === entry.mode && entry.score > e.score) {
              return { ...e, ...dataToSave, updated_at: new Date().toISOString() }
            }
            return e
          })
          saveOfflineLeaderboard(updatedOfflineData)

          return existingEntry // Return existing entry as fallback
        }
      }

      console.log("No update needed - existing entry has better score")
      return existingEntry
    } else {
      // Create a new entry
      console.log("Creating new leaderboard entry")

      // Add timestamps if the columns exist
      if (availableColumns.includes("created_at")) {
        dataToSave.created_at = new Date().toISOString()
      }
      if (availableColumns.includes("updated_at")) {
        dataToSave.updated_at = new Date().toISOString()
      }

      try {
        const { data, error } = await supabase.from("leaderboard").insert([dataToSave]).select()

        if (error) {
          console.error("Error creating leaderboard entry:", error)

          // Add to offline data
          const newOfflineEntry = {
            ...dataToSave,
            id: `offline-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          saveOfflineLeaderboard([...offlineData, newOfflineEntry])

          return newOfflineEntry
        }

        console.log("New entry created successfully:", data)

        // Add to offline data
        if (data && data[0]) {
          saveOfflineLeaderboard([...offlineData, data[0]])
        }

        return data?.[0] || null
      } catch (insertErr) {
        console.error("Exception during insert:", insertErr)

        // Add to offline data
        const newOfflineEntry = {
          ...dataToSave,
          id: `offline-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        saveOfflineLeaderboard([...offlineData, newOfflineEntry])

        return newOfflineEntry
      }
    }
  } catch (err) {
    console.error("Exception in saveLeaderboardEntry:", err)
    return null
  }
}
