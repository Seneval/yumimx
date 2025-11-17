/**
 * UpgradePrompt Component
 *
 * Modal shown when free users hit message limit.
 * Compares Free vs Paid features.
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradePrompt({ open, onOpenChange }: UpgradePromptProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Actualiza a YumiMX Pro
          </DialogTitle>
          <DialogDescription>
            Desbloquea todas las funciones para explorar tus sueños sin límites
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Comparison Table */}
          <div className="grid grid-cols-2 gap-4">
            {/* Free Column */}
            <div className="space-y-3">
              <div className="text-center">
                <Badge variant="outline">Gratis</Badge>
                <p className="text-2xl font-bold mt-2">$0</p>
                <p className="text-sm text-muted-foreground">por mes</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sueños ilimitados</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>3 mensajes por sueño</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Sin historial</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Sin contexto</span>
                </div>
              </div>
            </div>

            {/* Paid Column */}
            <div className="space-y-3 border-2 border-primary rounded-lg p-3 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">Recomendado</Badge>
              </div>
              <div className="text-center">
                <Badge>Pro</Badge>
                <p className="text-2xl font-bold mt-2">$9.99</p>
                <p className="text-sm text-muted-foreground">por mes</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Todo de Gratis +</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mensajes ilimitados</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Dream journal completo</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Contexto personal</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 pt-4">
            <Button className="w-full" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Actualizar a Pro
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Continuar como gratis
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-center text-muted-foreground">
            Nota: El sistema de pagos se implementará próximamente. Por ahora,
            contacta al administrador para upgradear.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
