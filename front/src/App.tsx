import { useState, useEffect } from 'react'
import { Server, CheckCircle2, XCircle, RefreshCw, Send, Database } from 'lucide-react'

interface Task {
  id: number
  title: string
  description?: string
  isCompleted: boolean
  createdAt?: string
}

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const backendUrl = 'http://localhost:3000'

  // Función para comprobar la conexión y obtener datos desde el backend
  const checkConnectionAndFetch = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`${backendUrl}/tasks`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
        setIsConnected(true)
      } else {
        setIsConnected(false)
        setErrorMsg(`El servidor respondió con código de estado: ${res.status}`)
      }
    } catch {
      setIsConnected(false)
      setErrorMsg('No se pudo conectar al servidor en http://localhost:3000')
    } finally {
      setLoading(false)
    }
  }

  // Comprobar conexión al cargar la página
  useEffect(() => {
    checkConnectionAndFetch()
  }, [])

  // Enviar un nuevo elemento para probar la escritura en la base de datos SQLite
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: inputText,
          description: `Guardado desde el frontend a las ${new Date().toLocaleTimeString()}`,
        }),
      })

      if (res.ok) {
        setInputText('')
        await checkConnectionAndFetch()
      } else {
        setErrorMsg('Error al guardar en el backend')
      }
    } catch {
      setErrorMsg('No se pudo enviar la petición al backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Comprobación FullStack</h1>
              <p className="text-xs text-slate-400">React (Vite) ⟷ NestJS (SQLite)</p>
            </div>
          </div>

          <button
            onClick={checkConnectionAndFetch}
            disabled={loading}
            className="btn btn-sm btn-ghost btn-circle text-slate-300 hover:bg-slate-700"
            title="Reintentar conexión"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-6">
          {/* Tarjeta de Estado de Conexión */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
              isConnected === true
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                : isConnected === false
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                : 'bg-slate-700/50 border-slate-600 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {isConnected === true && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              {isConnected === false && <XCircle className="w-6 h-6 text-rose-400" />}
              {isConnected === null && <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />}
              
              <div>
                <p className="font-semibold text-sm">
                  {isConnected === true && '¡Conexión Exitosa con el Backend!'}
                  {isConnected === false && 'Backend Desconectado'}
                  {isConnected === null && 'Comprobando conexión...'}
                </p>
                <p className="text-xs opacity-75">{backendUrl}</p>
              </div>
            </div>

            <span
              className={`badge badge-sm font-semibold ${
                isConnected === true
                  ? 'badge-success text-slate-900'
                  : isConnected === false
                  ? 'badge-error text-white'
                  : 'badge-ghost'
              }`}
            >
              {isConnected === true ? 'ONLINE' : isConnected === false ? 'OFFLINE' : 'PENDING'}
            </span>
          </div>

          {errorMsg && (
            <div className="alert alert-error text-xs py-2 px-3 rounded-lg shadow-sm">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Formulario simple para probar inserción */}
          <form onSubmit={handleSend} className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-primary" /> Probar inserción en SQLite:
            </label>
            <div className="join w-full">
              <input
                type="text"
                placeholder="Escribe algo (ej: Hola Backend)..."
                className="input input-bordered join-item w-full bg-slate-900 border-slate-700 text-sm focus:outline-none focus:border-primary"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!isConnected || loading}
              />
              <button
                type="submit"
                className="btn btn-primary join-item gap-1"
                disabled={!isConnected || !inputText.trim() || loading}
              >
                <Send className="w-4 h-4" /> Enviar
              </button>
            </div>
          </form>

          {/* Lista de registros desde la base de datos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Registros en la Base de Datos ({tasks.length})</span>
              <span>SQLite</span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/80 max-h-48 overflow-y-auto space-y-2">
              {tasks.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-4">
                  No hay registros aún en la base de datos SQLite.
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 bg-slate-800 rounded-lg text-xs border border-slate-700/50"
                  >
                    <div>
                      <p className="font-medium text-slate-200">{task.title}</p>
                      {task.description && (
                        <p className="text-[10px] text-slate-400">{task.description}</p>
                      )}
                    </div>
                    <span className="badge badge-xs badge-outline text-slate-400">ID #{task.id}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-700 text-center text-xs text-slate-500">
          Frontend en <span className="text-slate-300">localhost:5173</span> ⟷ Backend en <span className="text-slate-300">localhost:3000</span>
        </div>
      </div>
    </div>
  )
}

export default App
