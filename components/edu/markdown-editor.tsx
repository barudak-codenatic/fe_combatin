// components/MarkdownEditor.tsx
'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  initialTitle: string
  initialContent: string
  loading?: boolean
  onSubmit: (form: { title: string; content: string }) => void
}

const MarkdownEditor = ({ initialTitle, initialContent, onSubmit, loading }: Props) => {
  const [form, setForm] = useState({
    title: initialTitle,
    content: initialContent,
  })

  useEffect(() => {
    setForm({ title: initialTitle, content: initialContent })
  }, [initialTitle, initialContent])

  const handleChange = (value: string | undefined) => {
    setForm((prev) => ({ ...prev, content: value || '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Judul</label>
        <input
          type="text"
          name="title"
          className="w-full border border-gray-300 p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Konten Markdown</label>
        <MDEditor
          height={500}
          value={form.content}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Menyimpan...' : 'Simpan Materi'}
      </button>
    </form>
  )
}

export default MarkdownEditor