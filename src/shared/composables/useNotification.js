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
      if (window.confirm(message)) {
        onConfirm()
      } else {
        onCancel()
      }
    }
  }
}