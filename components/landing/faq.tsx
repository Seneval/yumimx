"use client";

import { useState } from "react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Cómo funciona la interpretación basada en Jung?",
      answer:
        "Nuestro asistente está entrenado en los conceptos fundamentales de Carl Jung: arquetipos (sombra, ánima/ánimus, self), el inconsciente colectivo, y el proceso de individuación. Cada interpretación considera estos elementos para ofrecerte insights profundos sobre el significado de tus sueños.",
    },
    {
      question: "¿Es realmente gratis?",
      answer:
        "Sí. El plan gratuito te permite interpretar sueños ilimitados con hasta 3 mensajes de seguimiento por sueño. No necesitas tarjeta de crédito y no hay cargos ocultos. El plan Pro ($9.99/mes) desbloquea conversaciones ilimitadas y funciones avanzadas.",
    },
    {
      question: "¿Qué tan privados son mis sueños?",
      answer:
        "Absolutamente privados. Tus sueños se almacenan con encriptación de nivel empresarial y nunca se comparten con terceros. Solo tú puedes acceder a tu diario de sueños. Ni siquiera nosotros podemos leer tus sueños sin tu permiso explícito.",
    },
    {
      question: "¿Puedo usar esto sin crear una cuenta?",
      answer:
        "Sí, puedes probar una interpretación gratuita directamente en la página de inicio sin registrarte. Sin embargo, para guardar tus sueños, ver tu historial y tener conversaciones más profundas, necesitarás crear una cuenta gratuita.",
    },
    {
      question: "¿Cómo se compara con un terapeuta humano?",
      answer:
        "No somos un reemplazo para la terapia profesional. Somos una herramienta complementaria que te ayuda a explorar tus sueños desde una perspectiva jungiana. Para problemas de salud mental serios, siempre recomendamos consultar con un profesional licenciado.",
    },
    {
      question: "¿Qué incluye el plan Pro?",
      answer:
        "El plan Pro te da mensajes ilimitados por sueño, un diario personal donde guardamos tu contexto, análisis de patrones a lo largo del tiempo, y la capacidad de exportar tus sueños. También obtienes soporte prioritario y acceso temprano a nuevas funciones.",
    },
    {
      question: "¿Puedo cancelar en cualquier momento?",
      answer:
        "Absolutamente. Puedes cancelar tu suscripción Pro en cualquier momento desde tu panel de control. No hay contratos ni penalizaciones. Tu cuenta volverá al plan gratuito automáticamente al final del período de facturación.",
    },
    {
      question: "¿En qué idiomas está disponible?",
      answer:
        "Actualmente, YumiMX está disponible en español. Estamos trabajando para añadir soporte para inglés, portugués y otros idiomas próximamente.",
    },
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-base font-semibold leading-7 text-violet-600">
            Preguntas Frecuentes
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            ¿Tienes preguntas?
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Aquí están las respuestas a las preguntas más comunes
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:border-violet-300 hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <svg
                  className={`h-6 w-6 flex-shrink-0 text-violet-600 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="border-t border-gray-100 px-6 py-5 text-gray-600">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900">
            ¿Aún tienes preguntas?
          </h3>
          <p className="mt-4 text-gray-600">
            Estamos aquí para ayudarte. Contáctanos en{" "}
            <a
              href="mailto:hola@yumimx.com"
              className="font-semibold text-violet-600 hover:text-violet-700"
            >
              hola@yumimx.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
