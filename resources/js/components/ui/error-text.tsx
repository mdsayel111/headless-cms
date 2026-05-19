import { Bug } from 'lucide-react'

export default function ErrorText({ error }: { error?: string }) {
    return (
        <>
            {
                error && (
                    <p className="mt-1 text-sm text-red-500 flex gap-1 items-center mt-2" id="email-error ">
                        <Bug className="text-lg" /> {error}
                    </p>
                )
            }
        </>
    )
}
