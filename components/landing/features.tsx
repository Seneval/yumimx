export function Features() {
  const features = [
    {
      icon: "🧠",
      title: "Psicología Jungiana Auténtica",
      description:
        "Interpretaciones basadas en los conceptos de Carl Jung: arquetipos, sombra, ánima/ánimus, y el proceso de individuación.",
    },
    {
      icon: "💬",
      title: "Conversaciones Profundas",
      description:
        "No solo una interpretación. Mantén un diálogo continuo para explorar los matices y significados más profundos de tus sueños.",
    },
    {
      icon: "📔",
      title: "Diario de Sueños Personal",
      description:
        "Guarda todos tus sueños y sus interpretaciones. Observa patrones y evolución en tu inconsciente a lo largo del tiempo.",
    },
    {
      icon: "🔒",
      title: "100% Privado y Seguro",
      description:
        "Tus sueños son profundamente personales. Todo se guarda con encriptación de nivel empresarial y nunca se comparte.",
    },
    {
      icon: "⚡",
      title: "Respuestas Instantáneas",
      description:
        "No esperes días por una interpretación. Obtén insights profundos en segundos, disponible 24/7.",
    },
    {
      icon: "🌟",
      title: "Contexto Personalizado",
      description:
        "Para usuarios Pro: el asistente aprende de ti y adapta las interpretaciones a tu vida, experiencias y proceso personal.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-violet-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-violet-600">
            Tecnología + Psicología
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Todo lo que necesitas para explorar tu inconsciente
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Una plataforma diseñada específicamente para el análisis profundo de
            sueños, combinando sabiduría psicológica con tecnología moderna.
          </p>
        </div>

        {/* Features grid */}
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-3xl border border-violet-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-violet-400 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="mb-6 text-5xl">{feature.icon}</div>

                {/* Content */}
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>

                {/* Hover accent */}
                <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 rounded-b-3xl bg-gradient-to-r from-violet-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            ))}
          </dl>
        </div>

        {/* CTA section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-4 text-white shadow-lg">
            <span className="text-lg font-semibold">
              Más de 3 millones de sueños interpretados
            </span>
            <span className="text-2xl">✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}
