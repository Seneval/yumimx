/**
 * TierBadge Component
 *
 * Visual badge showing user's current tier.
 * Can be used in navbar, profile, etc.
 */

"use client";

import { Badge } from "@/components/ui/badge";
import type { UserTier } from "@/types/subscription";
import { Crown, User } from "lucide-react";

interface TierBadgeProps {
  tier: UserTier;
  className?: string;
  showIcon?: boolean;
}

export function TierBadge({
  tier,
  className,
  showIcon = true,
}: TierBadgeProps) {
  if (tier === "paid") {
    return (
      <Badge variant="default" className={className}>
        {showIcon && <Crown className="w-3 h-3 mr-1" />}
        Pro
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={className}>
      {showIcon && <User className="w-3 h-3 mr-1" />}
      Gratis
    </Badge>
  );
}
