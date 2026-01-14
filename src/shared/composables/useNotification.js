// composables/useNotification.js
import { useToast } from 'vue-toastification'

export function useNotification() {
  const toast = useToast()

  return {
    success: (message, title = '') => {
      const content = title ? `<strong>${title}</strong><br>${message}` : message
      toast.success(content, {
        dangerouslyHTMLString: !!title
      })
    },

    error: (message, title = 'Error') => {
      const content = title ? `<strong>${title}</strong><br>${message}` : message
      toast.error(content, {
        dangerouslyHTMLString: !!title
      })
    },

    warning: (message, title = '') => {
      const content = title ? `<strong>${title}</strong><br>${message}` : message
      toast.warning(content, {
        dangerouslyHTMLString: !!title
      })
    },

    info: (message, title = '') => {
      const content = title ? `<strong>${title}</strong><br>${message}` : message
      toast.info(content, {
        dangerouslyHTMLString: !!title
      })
    },

    confirm: (message, onConfirm, onCancel = () => {}) => {
      const confirmToast = toast.info(
        `
        <div style="margin-bottom: 12px;">${message}</div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button 
            id="toast-cancel-btn" 
            style="padding: 6px 16px; border-radius: 6px; border: 1px solid #ddd; background: white; cursor: pointer;"
          >
            Cancelar
          </button>
          <button 
            id="toast-confirm-btn"
            style="padding: 6px 16px; border-radius: 6px; border: none; background: #2563eb; color: white; cursor: pointer;"
          >
            Confirmar
          </button>
        </div>
        `,
        {
          dangerouslyHTMLString: true,
          timeout: false,
          closeOnClick: false,
          closeButton: false,
          onMounted: (payload) => {
            const confirmBtn = document.getElementById('toast-confirm-btn')
            const cancelBtn = document.getElementById('toast-cancel-btn')

            confirmBtn?.addEventListener('click', () => {
              onConfirm()
              toast.dismiss(payload.id)
            })

            cancelBtn?.addEventListener('click', () => {
              onCancel()
              toast.dismiss(payload.id)
            })
          }
        }
      )
    }
  }
}