import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Music, 
  Plus, 
  Send, 
  Calendar, 
  Settings, 
  LogOut,
  User,
  Home,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Key,
  Eye,
  EyeOff
} from 'lucide-react'
import './App.css'

// Configurazione API
const API_BASE_URL = 'https://michele1977.pythonanywhere.com/'

// Componente per l'autenticazione
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.user)
      } else {
        setError(data.error || 'Errore durante l\'autenticazione')
      }
    } catch (err) {
      setError('Errore di connessione al server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Social Media Publisher</CardTitle>
          <CardDescription>
            {isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente per la sidebar
function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'create', label: 'Crea Post', icon: Plus },
    { id: 'accounts', label: 'Account Social', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Impostazioni', icon: Settings },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Social Publisher</h1>
        <p className="text-sm text-gray-500 mt-1">Ciao, {user.name}</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full flex items-center justify-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Esci
        </Button>
      </div>
    </div>
  )
}

// Componente Dashboard
function Dashboard({ posts, socialAccounts }) {
  const connectedPlatforms = socialAccounts.length
  const totalPosts = posts.length
  const publishedPosts = posts.filter(p => p.status === 'published').length
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Panoramica delle tue attività sui social media</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Piattaforme Collegate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{connectedPlatforms}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Post Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPosts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Post Pubblicati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{publishedPosts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Post Programmati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{scheduledPosts}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Post Recenti</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nessun post creato ancora</p>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{post.title || 'Post senza titolo'}</h4>
                    <p className="text-sm text-gray-600 mt-1">{post.content.substring(0, 100)}...</p>
                    <div className="flex items-center mt-2 space-x-2">
                      {post.platforms.map((platform) => {
                        const icons = {
                          facebook: Facebook,
                          instagram: Instagram,
                          linkedin: Linkedin,
                          twitter: Twitter,
                          tiktok: Music
                        }
                        const Icon = icons[platform]
                        return Icon ? <Icon key={platform} className="w-4 h-4 text-gray-400" /> : null
                      })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={post.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente per il badge di stato
function StatusBadge({ status }) {
  const statusConfig = {
    draft: { label: 'Bozza', color: 'bg-gray-100 text-gray-800', icon: Clock },
    published: { label: 'Pubblicato', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    failed: { label: 'Fallito', color: 'bg-red-100 text-red-800', icon: XCircle },
    scheduled: { label: 'Programmato', color: 'bg-blue-100 text-blue-800', icon: Calendar },
    partial: { label: 'Parziale', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
  }
  
  const config = statusConfig[status] || statusConfig.draft
  const Icon = config.icon
  
  return (
    <Badge className={`${config.color} flex items-center space-x-1`}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  )
}

// Componente per creare post
function CreatePost({ onPostCreated, socialAccounts }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platforms: [],
    scheduled_at: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const platformIcons = {
    facebook: { icon: Facebook, name: 'Facebook', color: 'text-blue-600' },
    instagram: { icon: Instagram, name: 'Instagram', color: 'text-pink-600' },
    linkedin: { icon: Linkedin, name: 'LinkedIn', color: 'text-blue-700' },
    twitter: { icon: Twitter, name: 'Twitter', color: 'text-blue-400' },
    tiktok: { icon: Music, name: 'TikTok', color: 'text-black' }
  }

  const availablePlatforms = socialAccounts.map(acc => acc.platform)

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Post creato con successo!')
        setFormData({
          title: '',
          content: '',
          platforms: [],
          scheduled_at: ''
        })
        onPostCreated(data.post)
      } else {
        setError(data.error || 'Errore durante la creazione del post')
      }
    } catch (err) {
      setError('Errore di connessione al server')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!formData.content.trim()) {
      setError('Il contenuto del post è obbligatorio')
      return
    }
    
    if (formData.platforms.length === 0) {
      setError('Seleziona almeno una piattaforma')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Prima crea il post
      const createResponse = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const createData = await createResponse.json()

      if (!createResponse.ok) {
        setError(createData.error || 'Errore durante la creazione del post')
        return
      }

      // Poi pubblica il post
      const publishResponse = await fetch(`${API_BASE_URL}/posts/${createData.post.id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      const publishData = await publishResponse.json()

      if (publishResponse.ok) {
        setSuccess(`Post pubblicato su ${publishData.results.filter(r => r.status === 'success').length}/${publishData.results.length} piattaforme`)
        setFormData({
          title: '',
          content: '',
          platforms: [],
          scheduled_at: ''
        })
        onPostCreated(publishData.post)
      } else {
        setError(publishData.error || 'Errore durante la pubblicazione del post')
      }
    } catch (err) {
      setError('Errore di connessione al server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Crea Nuovo Post</h2>
        <p className="text-gray-600">Crea e pubblica contenuti su tutte le tue piattaforme social</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dettagli del Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titolo (opzionale)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Inserisci un titolo per il tuo post..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenuto *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Scrivi il contenuto del tuo post..."
                rows={6}
                required
              />
              <p className="text-sm text-gray-500">{formData.content.length} caratteri</p>
            </div>

            <div className="space-y-3">
              <Label>Piattaforme di Destinazione *</Label>
              {availablePlatforms.length === 0 ? (
                <p className="text-gray-500">Nessun account social collegato. Vai alla sezione Account Social per collegare i tuoi account.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availablePlatforms.map((platform) => {
                    const config = platformIcons[platform]
                    if (!config) return null
                    
                    const Icon = config.icon
                    const isSelected = formData.platforms.includes(platform)
                    
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handlePlatformToggle(platform)}
                        className={`flex items-center space-x-3 p-3 border rounded-lg transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${config.color}`} />
                        <span className="font-medium">{config.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Programmazione (opzionale)</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
              />
              <p className="text-sm text-gray-500">Lascia vuoto per pubblicare immediatamente</p>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
            )}

            {success && (
              <div className="text-green-500 text-sm bg-green-50 p-3 rounded-lg">{success}</div>
            )}

            <div className="flex space-x-3">
              <Button type="submit" variant="outline" disabled={loading}>
                {loading ? 'Salvando...' : 'Salva come Bozza'}
              </Button>
              <Button 
                type="button" 
                onClick={handlePublish} 
                disabled={loading || availablePlatforms.length === 0}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Pubblicando...' : 'Pubblica Ora'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente per la gestione delle credenziali API
function CredentialsDialog({ platform, platformConfig, onCredentialsSaved }) {
  const [open, setOpen] = useState(false)
  const [credentials, setCredentials] = useState({
    client_id: '',
    client_secret: '',
    access_token: '',
    app_id: '',
    app_secret: ''
  })
  const [showSecrets, setShowSecrets] = useState({
    client_secret: false,
    access_token: false,
    app_secret: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const config = platformConfig[platform]
  const Icon = config.icon

  // Configurazione dei campi per ogni piattaforma
  const platformFields = {
    facebook: [
      { key: 'app_id', label: 'App ID', type: 'text', required: true },
      { key: 'app_secret', label: 'App Secret', type: 'password', required: true }
    ],
    instagram: [
      { key: 'client_id', label: 'Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true }
    ],
    linkedin: [
      { key: 'client_id', label: 'Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true }
    ],
    twitter: [
      { key: 'client_id', label: 'Client ID (API Key)', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret (API Secret)', type: 'password', required: true },
      { key: 'access_token', label: 'Access Token', type: 'password', required: false }
    ],
    tiktok: [
      { key: 'client_id', label: 'Client Key', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true }
    ]
  }

  const fields = platformFields[platform] || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/social-accounts/credentials/${platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Credenziali salvate con successo!')
        onCredentialsSaved(platform)
        setTimeout(() => {
          setOpen(false)
          setSuccess('')
          setCredentials({
            client_id: '',
            client_secret: '',
            access_token: '',
            app_id: '',
            app_secret: ''
          })
        }, 2000)
      } else {
        setError(data.error || 'Errore durante il salvataggio delle credenziali')
      }
    } catch (err) {
      setError('Errore di connessione al server')
    } finally {
      setLoading(false)
    }
  }

  const toggleShowSecret = (field) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Key className="w-4 h-4 mr-2" />
          Configura API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className={`p-2 rounded ${config.color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span>Credenziali API {config.name}</span>
          </DialogTitle>
          <DialogDescription>
            Inserisci le credenziali API per {config.name}. Puoi ottenerle dal portale sviluppatori di {config.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id={field.key}
                  type={field.type === 'password' && !showSecrets[field.key] ? 'password' : 'text'}
                  value={credentials[field.key]}
                  onChange={(e) => setCredentials({...credentials, [field.key]: e.target.value})}
                  placeholder={`Inserisci ${field.label.toLowerCase()}`}
                  required={field.required}
                />
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => toggleShowSecret(field.key)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets[field.key] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm bg-green-50 p-3 rounded-lg">{success}</div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Annulla
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salva Credenziali'}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Come ottenere le credenziali:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            {platform === 'facebook' && (
              <>
                <p>1. Vai su <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">Facebook for Developers</a></p>
                <p>2. Crea una nuova app o seleziona un'app esistente</p>
                <p>3. Copia l'App ID e l'App Secret dalla dashboard</p>
              </>
            )}
            {platform === 'instagram' && (
              <>
                <p>1. Vai su <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">Facebook for Developers</a></p>
                <p>2. Configura Instagram Basic Display API</p>
                <p>3. Copia il Client ID e Client Secret</p>
              </>
            )}
            {platform === 'linkedin' && (
              <>
                <p>1. Vai su <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="underline">LinkedIn Developers</a></p>
                <p>2. Crea una nuova app</p>
                <p>3. Copia il Client ID e Client Secret</p>
              </>
            )}
            {platform === 'twitter' && (
              <>
                <p>1. Vai su <a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="underline">Twitter Developer</a></p>
                <p>2. Crea una nuova app</p>
                <p>3. Copia API Key, API Secret e Access Token</p>
              </>
            )}
            {platform === 'tiktok' && (
              <>
                <p>1. Vai su <a href="https://developers.tiktok.com" target="_blank" rel="noopener noreferrer" className="underline">TikTok for Developers</a></p>
                <p>2. Crea una nuova app</p>
                <p>3. Copia il Client Key e Client Secret</p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente per gestire gli account social
function SocialAccounts({ socialAccounts, onAccountsUpdate }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [credentialsStatus, setCredentialsStatus] = useState({})

  const platformConfig = {
    facebook: { icon: Facebook, name: 'Facebook', color: 'bg-blue-600' },
    instagram: { icon: Instagram, name: 'Instagram', color: 'bg-pink-600' },
    linkedin: { icon: Linkedin, name: 'LinkedIn', color: 'bg-blue-700' },
    twitter: { icon: Twitter, name: 'Twitter', color: 'bg-blue-400' },
    tiktok: { icon: Music, name: 'TikTok', color: 'bg-black' }
  }

  // Carica lo stato delle credenziali
  useEffect(() => {
    loadCredentialsStatus()
  }, [])

  const loadCredentialsStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/social-accounts/credentials/status`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setCredentialsStatus(data.status)
      }
    } catch (err) {
      console.error('Error loading credentials status:', err)
    }
  }

  const handleCredentialsSaved = (platform) => {
    setCredentialsStatus(prev => ({
      ...prev,
      [platform]: true
    }))
  }

  const handleConnect = async (platform) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/social-accounts/connect/${platform}`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        // Apri la finestra di autorizzazione OAuth
        window.open(data.auth_url, '_blank', 'width=600,height=600')
        
        // Polling per verificare se l'account è stato collegato
        const checkConnection = setInterval(async () => {
          try {
            const accountsResponse = await fetch(`${API_BASE_URL}/social-accounts`, {
              credentials: 'include'
            })
            const accountsData = await accountsResponse.json()
            
            if (accountsResponse.ok) {
              const hasNewAccount = accountsData.accounts.some(acc => 
                acc.platform === platform && 
                !socialAccounts.some(existing => existing.id === acc.id)
              )
              
              if (hasNewAccount) {
                onAccountsUpdate(accountsData.accounts)
                clearInterval(checkConnection)
                setLoading(false)
              }
            }
          } catch (err) {
            console.error('Error checking connection:', err)
          }
        }, 2000)

        // Ferma il polling dopo 2 minuti
        setTimeout(() => {
          clearInterval(checkConnection)
          setLoading(false)
        }, 120000)
        
      } else {
        setError(data.error || 'Errore durante la connessione')
        setLoading(false)
      }
    } catch (err) {
      setError('Errore di connessione al server')
      setLoading(false)
    }
  }

  const handleDisconnect = async (accountId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/social-accounts/${accountId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        onAccountsUpdate(socialAccounts.filter(acc => acc.id !== accountId))
      } else {
        const data = await response.json()
        setError(data.error || 'Errore durante la disconnessione')
      }
    } catch (err) {
      setError('Errore di connessione al server')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Social</h2>
        <p className="text-gray-600">Gestisci i tuoi account social collegati</p>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(platformConfig).map(([platform, config]) => {
          const Icon = config.icon
          const connectedAccount = socialAccounts.find(acc => acc.platform === platform)
          const hasCredentials = credentialsStatus[platform]
          
          return (
            <Card key={platform}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${config.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{config.name}</h3>
                    {connectedAccount ? (
                      <div>
                        <p className="text-sm text-gray-600">{connectedAccount.account_name}</p>
                        <Badge className="mt-1 bg-green-100 text-green-800">Collegato</Badge>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">Non collegato</p>
                        {hasCredentials && (
                          <Badge className="mt-1 bg-blue-100 text-blue-800">API Configurata</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  {!hasCredentials && (
                    <CredentialsDialog 
                      platform={platform} 
                      platformConfig={platformConfig}
                      onCredentialsSaved={handleCredentialsSaved}
                    />
                  )}
                  
                  {connectedAccount ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(connectedAccount.id)}
                      className="w-full"
                    >
                      Disconnetti
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(platform)}
                      disabled={loading || !hasCredentials}
                      className="w-full"
                    >
                      {loading ? 'Connettendo...' : 'Connetti'}
                    </Button>
                  )}
                  
                  {hasCredentials && (
                    <CredentialsDialog 
                      platform={platform} 
                      platformConfig={platformConfig}
                      onCredentialsSaved={handleCredentialsSaved}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!Object.values(credentialsStatus).some(Boolean) && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Configura le tue API</h3>
              <p className="text-gray-600 mb-4">
                Per collegare i tuoi account social, devi prima configurare le credenziali API per ogni piattaforma.
                Clicca su "Configura API" per ogni social media che vuoi utilizzare.
              </p>
              <p className="text-sm text-gray-500">
                Le credenziali API sono necessarie per autorizzare l'applicazione a pubblicare contenuti sui tuoi account social.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {socialAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Account Collegati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {socialAccounts.map((account) => {
                const config = platformConfig[account.platform]
                if (!config) return null
                
                const Icon = config.icon
                
                return (
                  <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded ${config.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{config.name}</h4>
                        <p className="text-sm text-gray-600">{account.account_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Attivo</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                      >
                        Disconnetti
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente principale dell'app
function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [posts, setPosts] = useState([])
  const [socialAccounts, setSocialAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  // Verifica se l'utente è già autenticato
  useEffect(() => {
    checkAuth()
  }, [])

  // Carica i dati quando l'utente è autenticato
  useEffect(() => {
    if (user) {
      loadPosts()
      loadSocialAccounts()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (err) {
      console.error('Error checking auth:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (err) {
      console.error('Error loading posts:', err)
    }
  }

  const loadSocialAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/social-accounts`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setSocialAccounts(data.accounts)
      }
    } catch (err) {
      console.error('Error loading social accounts:', err)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err) {
      console.error('Error logging out:', err)
    } finally {
      setUser(null)
      setPosts([])
      setSocialAccounts([])
      setActiveTab('dashboard')
    }
  }

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  const handleAccountsUpdate = (accounts) => {
    setSocialAccounts(accounts)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <Dashboard posts={posts} socialAccounts={socialAccounts} />
          )}
          {activeTab === 'create' && (
            <CreatePost onPostCreated={handlePostCreated} socialAccounts={socialAccounts} />
          )}
          {activeTab === 'accounts' && (
            <SocialAccounts 
              socialAccounts={socialAccounts} 
              onAccountsUpdate={handleAccountsUpdate} 
            />
          )}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600">Le funzionalità di analytics saranno disponibili presto</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Impostazioni</h3>
              <p className="text-gray-600">Le impostazioni saranno disponibili presto</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App

