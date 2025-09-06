import { redirect } from 'next/navigation'

export default function AssinaturaPage() {
  // Redireciona para o portal de cobrança do Stripe
  // Esta URL deve ser configurada com o portal real do Stripe
  redirect('https://billing.stripe.com/p/login/test_XXXXXXXX')
}
