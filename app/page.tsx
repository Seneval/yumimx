import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <FAQ />

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">
                Yumi<span className="text-violet-400">MX</span>
              </h3>
              <p className="text-sm">
                Interpreta tus sueños con psicología Jungiana. Explora tu
                inconsciente y descubre tu verdadero ser.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">
                Recursos
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Guía de Jung
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Símbolos Oníricos
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Términos
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hola@yumimx.com"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 YumiMX. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
