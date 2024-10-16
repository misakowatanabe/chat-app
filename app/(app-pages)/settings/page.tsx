import { createClient } from '@/utils/supabase/server'
import { resetPasswordAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function Settings({ searchParams }: { searchParams: Message }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-fit overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
        <h1 className="text-2xl font-medium">Reset password</h1>
        <p className="text-sm text-foreground/60">Please enter your new password below.</p>
        <Label htmlFor="password">New password</Label>
        <Input type="password" name="password" placeholder="New password" required />
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input type="password" name="confirmPassword" placeholder="Confirm password" required />
        <SubmitButton formAction={resetPasswordAction}>Reset password</SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </>
  )
}
