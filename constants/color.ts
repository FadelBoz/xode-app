/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
export const color = {
    light:{
        background: "#F1F5F9",           // 210 40% 98%
        foreground: "#0F172A",           // 222 47% 11%
      
        card: "#FFFFFF",                 // 0 0% 100%
        cardForeground: "#0F172A",       // 222 47% 11%
      
        popover: "#FFFFFF",              // 0 0% 100%
        popoverForeground: "#0F172A",    // 222 47% 11%
      
        primary: "#334155",              // 220.2 21.5% 22.5% (tu as une petite erreur sur ton css, je corrige ici)
        primaryForeground: "#F1F5F9",    // 210 40% 98%
      
        secondary: "#F8FAFC",            // 210 40% 96%
        secondaryForeground: "#0F172A",  // 222 47% 11%
      
        muted: "#F8FAFC",                // 210 40% 96%
        mutedForeground: "#64748B",      // 215 16% 47%
      
        accent: "#F8FAFC",               // 210 40% 96%
        accentForeground: "#0F172A",     // 222 47% 11%
      
        destructive: "#EF4444",          // 0 84% 60%
        destructiveForeground: "#F1F5F9",// 210 40% 98%
      
        border: "#E2E8F0",               // 214 32% 91%
        input: "#E2E8F0",                // 214 32% 91%
        ring: "#64748B",                 // 220 14% 40%
      
        radius: 12,                      // 0.75rem en pixels (0.75*16)
        
        homerGradientStart: "#1A1033",   // Dégradé homer start
        homerGradientEnd: "#2C1854",

        text: '#11181C',
        text2 : '#8D8D8D',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,

        orange: "#FFBF81", 
        jaune: "#FFDC5E", 
        pink: "#FF69EB"
    },
    dark:{
        background: "#1A1A1A",            // 240 5% 10%
        foreground: "#E2E8F0",            // 220 14% 96%
        
        card: "#232323",                  // 240 6% 14%
        cardForeground: "#E2E8F0",         // 220 14% 96%
        
        popover: "#232323",                // 240 6% 14%
        popoverForeground: "#E2E8F0",      // 220 14% 96%
        
        primary: "#A1A1AA",                // 240 5% 65%
        primaryForeground: "#1A1A1A",      // 240 5% 10%
        
        secondary: "#333333",              // 240 4% 20%
        secondaryForeground: "#E2E8F0",    // 220 14% 96%
        
        muted: "#333333",                  // 240 4% 20%
        mutedForeground: "#B3B3B3",        // 240 5% 74%
        
        accent: "#333333",                 // 240 4% 20%
        accentForeground: "#E2E8F0",       // 220 14% 96%
        
        destructive: "#B91C1C",            // 0 62% 41%
        destructiveForeground: "#E2E8F0",  // 220 14% 96%
        
        border: "#2A2D31",                 // 240 4% 20%
        input: "#333333",                  // 240 4% 20%
        ring: "#A1A1AA" ,                // 240 5% 65%

        text: '#ECEDEE',
        text2 : '#8D8D8D',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,

        orange: "#FFBF81", 
        jaune: "#FFDC5E", 
        pink: "#FF69EB"
        
    }
}

