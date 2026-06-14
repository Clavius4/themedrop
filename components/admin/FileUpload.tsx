'use client'

import { useRef, useState } from 'react'
import { Upload, CheckCircle2, XCircle, Loader2, X } from 'lucide-react'

interface FileUploadProps {
  label: string
  accept: string
  bucket: 'previews' | 'downloads'
  storagePath: string // e.g. "peaky-blinders-windows.zip"
  value: string       // current public URL
  onChange: (url: string, size: string) => void
  preview?: boolean   // show image thumbnail
}

export default function FileUpload({ label, accept, bucket, storagePath, value, onChange, preview }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [fileName, setFileName] = useState('')
  const [thumbSrc, setThumbSrc] = useState(value || '')

  async function upload(file: File) {
    setStatus('uploading')
    setProgress(0)
    setFileName(file.name)
    setErrorMsg('')

    if (preview) {
      const reader = new FileReader()
      reader.onload = e => setThumbSrc(e.target?.result as string)
      reader.readAsDataURL(file)
    }

    try {
      // 1. Get signed upload URL from server
      const res = await fetch('/api/admin/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket, path: storagePath }),
      })
      if (!res.ok) throw new Error('Failed to get upload URL')
      const { signedUrl, publicUrl } = await res.json()

      // 2. Upload directly to Supabase Storage via XMLHttpRequest for progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', e => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        })
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed: ${xhr.status}`))
        })
        xhr.addEventListener('error', () => reject(new Error('Network error')))
        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
        xhr.send(file)
      })

      const sizeMB = (file.size / 1024 / 1024).toFixed(1)
      const sizeStr = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${sizeMB} MB`

      setStatus('done')
      onChange(publicUrl, sizeStr)
    } catch (e) {
      setStatus('error')
      setErrorMsg(String(e))
    }
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    setStatus('idle')
    setFileName('')
    setThumbSrc('')
    setProgress(0)
    onChange('', '')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</label>

      <div
        className="relative rounded-xl cursor-pointer transition-all"
        style={{ border: `1px dashed ${status === 'done' ? 'rgba(74,222,128,0.5)' : status === 'error' ? 'rgba(248,113,113,0.5)' : 'var(--border)'}`, background: 'var(--bg-elevated)' }}
        onClick={() => status !== 'uploading' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) upload(f)
          }}
        />

        {/* Thumbnail for preview images */}
        {preview && thumbSrc && (
          <div className="relative aspect-video rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
            {status !== 'uploading' && (
              <button
                onClick={clear}
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Non-preview or no thumb yet */}
        {(!preview || !thumbSrc) && (
          <div className="flex items-center gap-3 p-4">
            <div className="flex-shrink-0">
              {status === 'idle' && <Upload size={18} style={{ color: 'var(--text-muted)' }} />}
              {status === 'uploading' && <Loader2 size={18} className="animate-spin" style={{ color: 'var(--gold)' }} />}
              {status === 'done' && <CheckCircle2 size={18} style={{ color: '#4ADE80' }} />}
              {status === 'error' && <XCircle size={18} style={{ color: '#F87171' }} />}
            </div>

            <div className="flex-1 min-w-0">
              {status === 'idle' && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Click to upload <span style={{ color: 'var(--text-secondary)' }}>{accept}</span>
                </p>
              )}
              {status === 'uploading' && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{fileName}</p>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, background: 'var(--gold)' }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{progress}%</p>
                </div>
              )}
              {status === 'done' && (
                <div className="flex items-center justify-between">
                  <p className="text-xs truncate" style={{ color: '#4ADE80' }}>{fileName || storagePath} — uploaded</p>
                  <button onClick={clear} className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}><X size={12} /></button>
                </div>
              )}
              {status === 'error' && (
                <p className="text-xs" style={{ color: '#F87171' }}>{errorMsg}</p>
              )}
            </div>
          </div>
        )}

        {/* Progress bar for previews */}
        {preview && status === 'uploading' && (
          <div className="px-4 pb-3">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--gold)' }} />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Uploading… {progress}%</p>
          </div>
        )}
      </div>

      {/* Show URL hint if already set */}
      {value && status === 'idle' && (
        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>Current: {value}</p>
      )}
    </div>
  )
}
