/**
 * FeatureLock Component
 *
 * Visual lock for paid features (journal, context).
 * Shows blur overlay with upgrade CTA.
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import { UpgradePrompt } from "./upgrade-prompt";

interface FeatureLockProps {
  featureName: string;
  featureDescription: string;
  children?: React.ReactNode;
  className?: string;
}

export function FeatureLock({
  featureName,
  featureDescription,
  children,
  className,
}: FeatureLockProps) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  return (
    <>
      <Card className={className}>
        <div className="relative">
          {/* Blurred content (if children provided) */}
          {children && (
            <div className="blur-sm pointer-events-none select-none">
              {children}
            </div>
          )}

          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-4 p-6 max-w-sm">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{featureName}</h3>
                <p className="text-sm text-muted-foreground">
                  {featureDescription}
                </p>
              </div>
              <Button onClick={() => setUpgradeModalOpen(true)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Actualizar a Pro
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <UpgradePrompt
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </>
  );
}
