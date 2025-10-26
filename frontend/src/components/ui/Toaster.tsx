import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
	id: string
	type: ToastType
	message: string
}

let addToastFn: ((type: ToastType, message: string) => void) | null = null

export const toast = {
	success: (message: string) => addToastFn?.('success', message),
	error: (message: string) => addToastFn?.('error', message),
	info: (message: string) => addToastFn?.('info', message),
}

export function Toaster() {
	const [toasts, setToasts] = useState<Toast[]>([])

	useEffect(() => {
		addToastFn = (type: ToastType, message: string) => {
			const id = Math.random().toString(36).substring(7)
			setToasts((prev) => [...prev, { id, type, message }])
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id))
			}, 5000)
		}
	}, [])

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}

	const getIcon = (type: ToastType) => {
		switch (type) {
			case 'success':
				return <CheckCircle className="w-5 h-5 text-green-500" />
			case 'error':
				return <XCircle className="w-5 h-5 text-red-500" />
			case 'info':
				return <Info className="w-5 h-5 text-blue-500" />
		}
	}

	const getStyles = (type: ToastType) => {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200'
			case 'error':
				return 'bg-red-50 border-red-200'
			case 'info':
				return 'bg-blue-50 border-blue-200'
		}
	}

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`flex items-center gap-3 p-4 rounded-lg border-2 shadow-lg ${getStyles(
						toast.type
					)} animate-in slide-in-from-right duration-300`}
				>
					{getIcon(toast.type)}
					<p className="text-sm font-medium text-gray-900">{toast.message}</p>
					<button
						onClick={() => removeToast(toast.id)}
						className="ml-auto text-gray-500 hover:text-gray-700"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			))}
		</div>
	)
}


