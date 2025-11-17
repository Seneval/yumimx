"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Gratuito",
      price: "$0",
      description: "Perfecto para empezar a explorar tus sueños",
      features: [
        "Interpretaciones ilimitadas de sueños",
        "3 mensajes de seguimiento por sueño",
        "Basado en psicología Jungiana",
        "Acceso 24/7",
        "Sin tarjeta de crédito",
      ],
      cta: "Comenzar gratis",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/mes",
      description: "Para quienes buscan exploración profunda",
      features: [
        "Todo lo del plan Gratuito",
        "Mensajes ilimitados por sueño",
        "Diario personal de sueños",
        "Contexto personalizado recordado",
        "Análisis de patrones a lo largo del tiempo",
        "Exporta tus sueños e interpretaciones",
        "Soporte prioritario",
      ],
      cta: "Empezar prueba de 7 días",
      popular: true,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-900 py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 to-gray-900" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-purple-900/20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-violet-400">
            Precios
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Elige el plan perfecto para ti
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Comienza gratis y actualiza cuando estés listo para ir más profundo
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? "border-2 border-violet-500 bg-white shadow-2xl"
                  : "border border-gray-700 bg-gray-800/50 backdrop-blur"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                    🌟 Más popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <h3
                className={`text-2xl font-bold ${
                  plan.popular ? "text-gray-900" : "text-white"
                }`}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-x-1">
                <span
                  className={`text-5xl font-bold tracking-tight ${
                    plan.popular ? "text-gray-900" : "text-white"
                  }`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={`text-lg ${
                      plan.popular ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className={`mt-4 text-sm ${
                  plan.popular ? "text-gray-600" : "text-gray-300"
                }`}
              >
                {plan.description}
              </p>

              {/* CTA */}
              <Button
                className={`mt-8 w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                    : "border-violet-500 bg-transparent hover:bg-violet-500/10"
                }`}
                size="lg"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>

              {/* Features */}
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 flex-shrink-0 ${
                        plan.popular ? "text-violet-600" : "text-violet-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-12 text-center text-sm text-gray-400">
          Todos los precios en USD. Cancela cuando quieras. Sin preguntas.
        </p>
      </div>
    </section>
  );
}
