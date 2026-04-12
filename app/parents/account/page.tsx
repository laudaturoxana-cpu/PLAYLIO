import { redirect } from 'next/navigation'

// Redirecționează permanent la noua rută /account (fără parents layout)
export default function OldAccountPage() {
  redirect('/account')
}
