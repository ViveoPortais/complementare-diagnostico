import useLogin from '@/hooks/useSession'
import React, { useEffect, useState, useCallback } from 'react'
import { toast } from "react-toastify";
import { AiOutlineClose } from 'react-icons/ai'
import Loading from '../loading/Loading'
import { useDrawer } from '@/hooks/useModal'

interface ModalProps {
  isOpen?: boolean
  title: string
  children?: React.ReactNode
  customClass?: string
  onClose: () => void
  isPasswordModal?: boolean
  isLoading?: boolean
  removeTitle?: boolean
  removeScroll?: boolean
  maxWidth?: string
}

const Modal = ({
  isOpen,
  title,
  children,
  customClass,
  onClose,
  isPasswordModal,
  isLoading,
  removeTitle,
  removeScroll,
  maxWidth
}: ModalProps) => {
  const [showModal, setShowModal] = useState(isOpen)
  const auth = useLogin()
  const drawer = useDrawer()

  useEffect(() => {
    drawer.isOpen && drawer.onClose()
    setShowModal(isOpen)
  }, [isOpen])

  const handleClose = useCallback(() => {
    if (auth.changePassword && isPasswordModal) {
      return toast.error('Você precisa alterar sua senha antes de continuar')
    }
    setShowModal(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [auth.changePassword, isPasswordModal, onClose])

  if (!isOpen) return null

  return (
    <div
      className={`flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70 xl:py-12 ${
        removeScroll ? 'overflow-y-hidden !important' : ''
      } `}
    >
      <div className={`relative my-auto mx-auto w-screen ${customClass}`} style={{ maxWidth }}>
        <div
          className={`translate duration-300 h-full 
          ${showModal ? 'translate-y-0' : 'translate-y-full'}
           ${showModal ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='translate border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div className='p-6'>
              {!removeTitle && (
                <div className='pb-3 flex justify-between border-b-[1px] border-gray-300'>
                  <div className='text-2xl font-bold tracking-wide text-blue'>
                    {title}
                  </div>
                  <div className='text-2xl cursor-pointer'>
                    <AiOutlineClose onClick={handleClose} />
                  </div>
                </div>
              )}
              {removeTitle && (
                <div className='text-2xl cursor-pointer flex justify-end'>
                  <AiOutlineClose onClick={handleClose} />
                </div>
              )}
              {isLoading ? (
                <div className='flex justify-center items-center h-96'>
                  <Loading />
                </div>
              ) : (
                <>{children}</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
