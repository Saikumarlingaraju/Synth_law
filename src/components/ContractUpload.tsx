import { useCallback, useState } from 'react'
import { Upload, FileText, X, FileImage, FileType, Camera, AlertTriangle } from 'lucide-react'

interface ContractUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

export default function ContractUpload({ onFileSelect, selectedFile }: ContractUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File | null) => {
    if (!file) {
      onFileSelect(null)
      setErrorMessage(null)
      return
    }

    const validMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ]

    const validExtensions = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg']
    const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? ''

    const isValidType = validMimeTypes.includes(file.type) || validExtensions.includes(fileExtension)

    if (!isValidType) {
      setErrorMessage('Unsupported file type. Please upload a PDF, Word document, or image file.')
      onFileSelect(null)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File is too large. Maximum size is 10MB.')
      onFileSelect(null)
      return
    }

    setErrorMessage(null)
    onFileSelect(file)
  }

  const getFileIcon = () => {
    if (!selectedFile) return FileText

    if (selectedFile.type.includes('pdf')) return FileText
    if (selectedFile.type.includes('word') || selectedFile.type.includes('document')) return FileType
    if (selectedFile.type.includes('image')) return FileImage
    return FileText
  }

  const FileIcon = getFileIcon()

  return (
    <div className="glass-card p-8">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            errorMessage
              ? 'border-danger-300 bg-danger-50'
              : dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,image/*"
          />

          <input
            type="file"
            id="camera-upload"
            className="hidden"
            onChange={handleCameraChange}
            accept="image/*"
            capture="environment"
          />

          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary-600" />
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Upload Your Contract
          </h3>
          <p className="text-slate-600 mb-6">
            Drag and drop or click to browse
          </p>

          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 cursor-pointer transition-colors"
          >
            Choose File
          </label>

          <label
            htmlFor="camera-upload"
            className="inline-flex items-center px-4 py-3 ml-3 border border-primary-200 text-primary-700 font-medium rounded-lg hover:bg-primary-50 cursor-pointer transition-colors"
          >
            <Camera className="w-4 h-4 mr-2" />
            Use Camera
          </label>

          <p className="text-sm text-slate-500 mt-4">
            Supports: PDF, Word (.doc, .docx), Images (for scanned contracts or camera capture)
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Maximum file size: 10MB
          </p>

          <p className="text-sm text-primary-700 mt-4">
            Need a sample? <a className="underline hover:text-primary-800" href="/SynthLaw_Test_Unfair_Freelancer_Contract_Sample.docx" download>Download a sample contract (DOCX)</a>
          </p>

          {errorMessage && (
            <div className="mt-6 text-left">
              <div className="flex items-start bg-danger-50 border border-danger-200 text-danger-700 rounded-lg px-4 py-3" role="alert" aria-live="polite">
                <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-danger-600" />
                <div>
                  <p className="text-sm font-semibold">Upload error</p>
                  <p className="text-sm">{errorMessage}</p>
                  <p className="text-xs text-danger-600 mt-1">Supported: PDF, Word (.doc, .docx), PNG, JPG. Max size 10MB.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-primary-200 rounded-xl p-6 bg-primary-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{selectedFile.name}</h4>
                <p className="text-sm text-slate-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setErrorMessage(null)
                onFileSelect(null)
              }}
              className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      )}

      {/* Supported Features */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-2xl mb-1">🔍</div>
          <p className="text-xs font-medium text-slate-700">OCR Support</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-xs font-medium text-slate-700">PII Masking</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-2xl mb-1">⚡</div>
          <p className="text-xs font-medium text-slate-700">2M Tokens</p>
        </div>
      </div>
    </div>
  )
}
