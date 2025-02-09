import { useState } from 'react'

import { Layout, useEventListener } from '~/components'

import { ADD_TOAST, REMOVE_TOAST } from '~/common/enums'

import { ToastWithEffect } from '../Instance'
import styles from './styles.css'

/**
 * ToastContainer is a place for managing Toast components. Use event system to
 * create and remove Toast components.
 *
 * Usage:
 *
 * ```jsx
 * <ToastContainer layout="" />
 * ```
 */

const prefix = 'toast-'
const maxToasts = 5 // number of toasts at most to display in the same time

const Container = () => {
  const [toasts, setToasts] = useState<any[]>([])

  const add = (payload: { [key: string]: any }) => {
    if (!payload || Object.keys(payload).length === 0) {
      return false
    }
    setToasts((prev) => [
      { id: `${prefix}${Date.now()}`, ...payload },
      ...prev.slice(0, maxToasts - 1),
    ])
  }

  const remove = ({ id }: { id: string }) => {
    if (!id || !id.startsWith(prefix)) {
      return
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEventListener(ADD_TOAST, add)
  useEventListener(REMOVE_TOAST, remove)

  const topToasts: any[] = []
  const bottomToasts: any[] = []
  toasts.forEach((t) => {
    if (t.placement === 'bottom') {
      bottomToasts.push(t)
    } else {
      topToasts.push(t)
    }
  })
  return (
    <section className="toast-container">
      <section className="toast-top">
        <Layout.FixedMain>
          {topToasts.map((toast) => (
            <ToastWithEffect key={toast.id} {...toast} />
          ))}
        </Layout.FixedMain>
      </section>

      <section className="toast-bottom">
        <Layout.FixedMain>
          {bottomToasts.map((toast) => (
            <ToastWithEffect key={toast.id} {...toast} />
          ))}
        </Layout.FixedMain>
      </section>

      <style jsx>{styles}</style>
    </section>
  )
}

export default Container
