export function validateCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]/g, "") // Remover caracteres não numéricos
  if (cpf.length !== 11) {
    return false // O CPF deve ter 11 dígitos
  }

  // Verificar se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cpf)) {
    return false
  }

  // Calcular o primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let primeiroDigito = 11 - (soma % 11)
  if (primeiroDigito > 9) {
    primeiroDigito = 0
  }

  // Verificar o primeiro dígito verificador
  if (parseInt(cpf.charAt(9)) !== primeiroDigito) {
    return false
  }

  // Calcular o segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i)
  }
  let segundoDigito = 11 - (soma % 11)
  if (segundoDigito > 9) {
    segundoDigito = 0
  }

  // Verificar o segundo dígito verificador
  if (parseInt(cpf.charAt(10)) !== segundoDigito) {
    return false
  }

  return true
}
