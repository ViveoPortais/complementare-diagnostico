'use client'

import { useState, useCallback } from 'react'
import serproAPI from '@/services/serpro-api'
import { validateCPF } from '@/helpers/validate-cpf'
import { toast } from 'react-toastify'

export function useCpfValidation() {
  const [isLoadingCpf, setIsLoadingCpf] = useState(false)

  /**
   * Retorna true se o CPF for válido, false caso contrário.
   */
  const isCpfValid = useCallback(async (rawCpf: string): Promise<boolean> => {
    const onlyDigits = rawCpf.replace(/\D/g, '')
    // validação client-side
    if (!onlyDigits || !validateCPF(onlyDigits)) {
      return false
    }

    setIsLoadingCpf(true)
    try {
      const { data } = await serproAPI.get(
        `/consulta-cpf-df/v1/cpf/${onlyDigits}`
      )
      // só considera válido se código for '1'
      return data.situacao.codigo === '1'
    } catch {
      return false
    } finally {
      setIsLoadingCpf(false)
    }
  }, [])

  return {
    isLoadingCpf,
    isCpfValid,
  }
}
