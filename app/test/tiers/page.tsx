/**
 * Tier System Test Page
 *
 * This page tests all tier-related functionality:
 * - useTier hook
 * - useMessageLimits hook
 * - All UI components
 * - Feature locks
 *
 * Navigate to /test/tiers to view
 */

"use client";

import { useState } from "react";
import { useTier } from "@/hooks/useTier";
import { useMessageLimits } from "@/hooks/useMessageLimits";
import { MessageCounter } from "@/components/tier/message-counter";
import { UpgradePrompt } from "@/components/tier/upgrade-prompt";
import { FeatureLock } from "@/components/tier/feature-lock";
import { TierBadge } from "@/components/tier/tier-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function TierTestPage() {
  const { tier, loading: tierLoading, isPaid, isFree } = useTier();
  const [testDreamId] = useState("test-dream-123");
  const { limits, loading: limitsLoading } = useMessageLimits(testDreamId);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  if (tierLoading) {
    return (
      <div className="container mx-auto py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Sistema de Tiers - Prueba</h1>
        <p className="text-muted-foreground">
          Página de prueba para verificar el funcionamiento del sistema de tiers
        </p>
      </div>

      {/* Current Tier Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tu Tier Actual</span>
            <TierBadge tier={tier} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tier:</p>
              <p className="font-mono font-bold">{tier}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Es Paid:</p>
              <p className="font-mono">{isPaid ? "Sí" : "No"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Es Free:</p>
              <p className="font-mono">{isFree ? "Sí" : "No"}</p>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              {isPaid ? (
                <>
                  Tienes acceso a <strong>todas las funciones</strong>: mensajes
                  ilimitados, dream journal, y contexto personal.
                </>
              ) : (
                <>
                  Estás en el tier <strong>gratuito</strong>. Tienes acceso
                  limitado a 3 mensajes de seguimiento por sueño.
                </>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Message Limits (solo si hay límites cargados) */}
      {!limitsLoading && limits && (
        <Card>
          <CardHeader>
            <CardTitle>Límites de Mensajes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Mensajes usados:</p>
                <p className="font-mono font-bold">{limits.messagesUsed}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Límite:</p>
                <p className="font-mono">
                  {limits.messagesLimit === null
                    ? "Ilimitado"
                    : limits.messagesLimit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">¿Puede enviar?:</p>
                <p className="font-mono">
                  {limits.canSendMessage ? "Sí" : "No"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Mensajes restantes:</p>
                <p className="font-mono">
                  {limits.remainingMessages === null
                    ? "Ilimitado"
                    : limits.remainingMessages}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Vista del contador:
              </p>
              <MessageCounter limits={limits} />
            </div>

            {!limits.canSendMessage && (
              <Button
                className="w-full"
                onClick={() => setUpgradeModalOpen(true)}
              >
                Ver opciones de upgrade
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Components Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Componentes UI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">TierBadge:</h3>
            <div className="flex gap-2">
              <TierBadge tier="free" />
              <TierBadge tier="paid" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">UpgradePrompt:</h3>
            <Button onClick={() => setUpgradeModalOpen(true)}>
              Abrir modal de upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Locks (solo para free users) */}
      {isFree && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Features Bloqueadas</h2>

          <FeatureLock
            featureName="Dream Journal"
            featureDescription="Accede a tu historial completo de sueños y descubre patrones a lo largo del tiempo."
          >
            <div className="p-8 space-y-4">
              <h3 className="text-xl font-bold">Mis Sueños</h3>
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <h4 className="font-semibold">Sueño del {i} Nov 2025</h4>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FeatureLock>

          <FeatureLock
            featureName="Contexto Personal"
            featureDescription="Proporciona información sobre ti para recibir interpretaciones más personalizadas."
          >
            <div className="p-8 space-y-4">
              <h3 className="text-xl font-bold">Mi Contexto</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Cuéntanos sobre ti:
                </label>
                <textarea
                  className="w-full border rounded-lg p-3"
                  rows={6}
                  placeholder="Edad, situación actual, temas importantes..."
                />
              </div>
            </div>
          </FeatureLock>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradePrompt
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />

      {/* Testing Notes */}
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Notas de Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Para probar límites de mensajes:</strong> Necesitas crear un
            sueño real y enviar mensajes. Esta página muestra un dreamId de
            prueba.
          </p>
          <p>
            <strong>Para cambiar tier:</strong> Actualiza directamente en
            Supabase Dashboard → user_profiles → tier
          </p>
          <p>
            <strong>Para ver features bloqueadas:</strong> Asegúrate de estar en
            tier free
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
