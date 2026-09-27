import React from "react";
import { KasaCreationHub } from "./KasaCreationHub";

interface PersonalGPTFrameworkProps {
  onNotify: (msg: string, type: "success" | "info" | "warning") => void;
  onRefreshData?: () => void;
  onNavigateToRegression?: () => void;
  fontWave?: boolean;
}

export const PersonalGPTFramework: React.FC<PersonalGPTFrameworkProps> = ({
  onNotify,
  fontWave = true
}) => {
  return <KasaCreationHub onNotify={onNotify} fontWave={fontWave} />;
};
