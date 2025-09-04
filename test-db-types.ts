import type { Database } from "./lib/database.types"

// Teste simples para verificar se a importação funciona
type TestType = Database["public"]["Tables"]

export { TestType }
