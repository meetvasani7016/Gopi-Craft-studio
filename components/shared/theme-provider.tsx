"use client";

import { useEffect } from "react";

interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  borderRadius: string;
  buttonStyle: string;
  logoText: string;
  fonts: { serif: string; sans: string };
  faviconUrl: string | null;
}

export function ThemeProvider({ theme }: { theme: ThemeSettings }) {
  useEffect(() => {
    if (!theme) return;

    // Apply primary color
    document.documentElement.style.setProperty("--color-primary", theme.primaryColor);
    
    // Apply accent color & derivatives
    document.documentElement.style.setProperty("--color-accent", theme.accentColor);
    
    // Calculate and apply border radius tokens
    const baseRadius = parseFloat(theme.borderRadius) || 0.5; // assumes rem/px
    const unit = theme.borderRadius.replace(/[0-9.]/g, "") || "rem";
    
    document.documentElement.style.setProperty("--radius-sm", `${baseRadius * 0.5}${unit}`);
    document.documentElement.style.setProperty("--radius-md", `${baseRadius}${unit}`);
    document.documentElement.style.setProperty("--radius-lg", `${baseRadius * 1.5}${unit}`);
    document.documentElement.style.setProperty("--radius-xl", `${baseRadius * 2}${unit}`);

    // Update favicon if set in DB
    if (theme.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "shortcut icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = theme.faviconUrl;
    }
  }, [theme]);

  // Build dynamic Google Fonts imports
  const serifFont = theme.fonts.serif.replace(/\s+/g, "+");
  const sansFont = theme.fonts.sans.replace(/\s+/g, "+");
  
  return (
    <>
      {/* Dynamic Font Loader */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=${serifFont}:ital,wght@0,300..900;1,300..900&family=${sansFont}:ital,wght@0,100..900;1,100..900&display=swap');
        
        :root {
          --color-primary: ${theme.primaryColor};
          --color-accent: ${theme.accentColor};
          --font-serif: "${theme.fonts.serif}", Georgia, serif;
          --font-sans: "${theme.fonts.sans}", system-ui, sans-serif;
          --radius-md: ${theme.borderRadius};
          --radius-sm: calc(${parseFloat(theme.borderRadius) * 0.5}${theme.borderRadius.replace(/[0-9.]/g, "") || "rem"});
          --radius-lg: calc(${parseFloat(theme.borderRadius) * 1.5}${theme.borderRadius.replace(/[0-9.]/g, "") || "rem"});
          --radius-xl: calc(${parseFloat(theme.borderRadius) * 2.0}${theme.borderRadius.replace(/[0-9.]/g, "") || "rem"});
        }

        /* Customize buttons based on button_style settings */
        ${theme.buttonStyle === "flat" ? `
          button, .btn {
            border-radius: 0px !important;
            box-shadow: none !important;
          }
        ` : ""}
        ${theme.buttonStyle === "pill" ? `
          button, .btn {
            border-radius: 9999px !important;
          }
        ` : ""}
      ` }} />
    </>
  );
}
