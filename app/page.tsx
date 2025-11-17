import { GoogleLoginButton } from "@/components/auth/google-login-button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
      <main className="flex w-full max-w-md flex-col items-center gap-8 px-6 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            Yumi<span className="text-indigo-600">MX</span>
          </h1>
          <p className="text-xl text-gray-600">
            Interpreta tus sueños con psicología Jungiana
          </p>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
              Descubre el significado de tus sueños
            </h2>
            <GoogleLoginButton />
          </div>

          <div className="space-y-3 text-center text-sm text-gray-600">
            <p className="font-medium">Plan Gratuito incluye:</p>
            <ul className="space-y-2">
              <li>✓ 3 mensajes de seguimiento por sueño</li>
              <li>✓ Interpretación basada en Carl Jung</li>
              <li>✓ Sin necesidad de tarjeta de crédito</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
