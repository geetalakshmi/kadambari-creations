import { useRef, useState } from 'react'
import Header from '../components/Header'
import { createProduct } from '../lib/api'

export default function Admin() {
  const [status, setStatus] = useState<string>('')
  const nameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const tokenRef = useRef<HTMLInputElement>(null)
  const subRef = useRef<HTMLInputElement>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Uploading...')

    const form = new FormData()
    if (nameRef.current) form.append('name', nameRef.current.value)
    if (priceRef.current) form.append('price', priceRef.current.value)
    if (categoryRef.current) form.append('category', categoryRef.current.value)
    if (descRef.current) form.append('description', descRef.current.value)
    if (fileRef.current && fileRef.current.files?.[0]) form.append('image', fileRef.current.files[0])

    if (subRef.current && subRef.current.value) {
    form.append("subcategory", subRef.current.value)
    }

    try {
      const token = tokenRef.current?.value || ''
      const p = await createProduct(form, token)
      setStatus('Saved: ' + p.name)
      if (nameRef.current) nameRef.current.value = ''
      if (priceRef.current) priceRef.current.value = ''
      if (categoryRef.current) categoryRef.current.value = ''
      if (descRef.current) descRef.current.value = ''
      if (fileRef.current) fileRef.current.value = ''
    } catch (err: any) {
      setStatus(err?.response?.data?.detail || 'Error while saving')
    }
  }

  return (
    <div>
      <Header />
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Admin — Add Product</h1>
        <p className="text-sm text-gray-500">Use this form to upload product images with category & price.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Token</label>
            <input ref={tokenRef} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="Enter admin token" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input ref={nameRef} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="Red Kurti" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
              <input ref={priceRef} type="number" step="0.01" className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="49.99" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input ref={categoryRef} required className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="women" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea ref={descRef} rows={4} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="Soft cotton kurti with hand embroidery."/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory (optional)</label>
            <input ref={subRef} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="lehenga / blouse / saree" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input ref={fileRef} type="file" accept="image/*" className="mt-1 w-full border rounded-xl px-3 py-2" />
          </div>
          <button className="btn bg-rose-600 text-white">Save Product</button>
          <div className="text-sm text-gray-600">{status}</div>
        </form>
      </div>
    </div>
  )
}
