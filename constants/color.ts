export const color = {
  // ===== Thème Clair (Light Theme) =====
  light: {
    // Couleurs de fond
    background: "#FFFFFF",      // Fond blanc principal
    background2: "#F2F3F5",     // Gris clair souvent utilisé pour les arrière-plans secondaires (ex: liste des serveurs, paramètres) - *Approximation*
    
    // Cartes et Popovers
    card: "#FFFFFF",            // Les cartes sont généralement blanches en thème clair
    cardForeground: "#060607",  // Texte noir ou très foncé sur les cartes - *Approximation*
    popover: "#FFFFFF",           // Fond des popovers et modales - *Approximation*
    popoverForeground: "#060607", // Texte dans les popovers - *Approximation*
    
    // Couleurs primaires et d'accentuation
    primary: "#5865F2",         // Blurple, la couleur principale de Discord
    primaryForeground: "#FFFFFF", // Texte sur les éléments avec fond Blurple
    accent: "#5865F2",           // Blurple utilisé comme couleur d'accentuation
    accentForeground: "#FFFFFF",  // Texte sur les éléments d'accentuation
    
    // Couleurs secondaires et neutres
    secondary: "#4E545C",       // Gris pour texte secondaire ou éléments moins importants - *Approximation*
    secondaryForeground: "#FFFFFF",// *Approximation*
    muted: "#747F8D",           // Gris pour texte désactivé ou annotations - *Approximation*
    mutedForeground: "#FFFFFF",   // *Approximation*
    
    // Couleurs sémantiques
    destructive: "#ED4245",      // Rouge Discord pour les actions destructrices et erreurs
    destructiveForeground: "#FFFFFF",
    validated: "#57F287",        // Vert Discord pour la validation et les succès
    // validatedForeground: "#000000", // Texte sur les éléments verts (pourrait aussi être blanc) - *À vérifier*
    
    // Bordures et champs de saisie
    border: "#E3E5E8",           // Bordure gris clair typique - *Approximation*
    input: "#373a43",            // Fond des champs de saisie - *Approximation*
    ring: "#5865F2",             // Couleur de l'anneau de focus, souvent Blurple
    
    // Texte et icônes
    text: "#ecedf2",             // Couleur de texte principale (Discord mentionne "gris foncé") - *Approximation*
    text2: "#82828a",            // Couleur de texte secondaire - *Approximation*
    icon: "#4E545C",   
    iconNoSelected:"#797981",
    tabIconDefault: "#747F8D",   // Icônes de navigation non sélectionnées - *Approximation*
    tabIconSelected: "#5865F2",  // Icônes de navigation sélectionnées (souvent Blurple)

    // Autres couleurs de la marque Discord
    yellow: "#FEE75C",
    fuchsia: "#EB459E",
    greyple: "#99aab5", 
    validatedGreen:"#2d6d48",
    redIcon: "#fb3e42"

  },

  // ===== Thème Sombre (Dark Theme) =====
  dark: {
    // Couleurs de fond
    background: "#15141a",      
    background2: "#1c1d22",    
    foreground: "#FFFFFF",      // Texte principal généralement blanc
    
    // Cartes et Popovers
    card: "#26262e",            // "Dark, but not black", souvent utilisé pour les cartes ou éléments en relief
    cardForeground: "#FFFFFF",    // Texte sur les cartes
    popover: "#18191c",           // Fond des popovers, souvent un peu plus clair que le fond principal - *Approximation*
    popoverForeground: "#DCDDDE", // Texte dans les popovers (blanc cassé/gris clair) - *Approximation*
    
    // Couleurs primaires et d'accentuation
    primary: "#5865F2",         // Blurple
    primaryForeground: "#FFFFFF",
    accent: "#5865F2",           // Blurple
    accentForeground: "#FFFFFF",
    
    // Couleurs secondaires et neutres
    secondary: "#B9BBBE",       // Gris clair pour texte secondaire - *Approximation*
    // secondaryForeground: "#000000", // *Approximation*
    muted: "#72767d",           // Gris moyen pour texte désactivé ou timestamps - *Approximation*
    // mutedForeground: "#000000",   // *Approximation*
    
    // Couleurs sémantiques
    destructive: "#ED4245",      // Rouge Discord
    destructiveForeground: "#ee2a15",
    validated: "#6667e6",        // Vert Discord
    // validatedForeground: "#000000", // *À vérifier*
    
    // Bordures et champs de saisie
    border: "#40444B",           // Bordure plus foncée pour séparer les éléments - *Approximation*
    input: "#373a43",            // Fond des champs de saisie, souvent similaire à `background2` - *Approximation*
    ring: "#5865F2",             // Anneau de focus Blurple
    
    // Texte et icônes
    text: "#FFFFFF",             // Texte principal blanc
    text2: "#B9BBBE",            // Texte secondaire gris clair - *Approximation*
    icon: "#c8c8d0",            // Icônes souvent en gris clair - *Approximation*
    iconNoSelected:"#797981",
    tabIconDefault: "#72767d",   // Icônes de navigation non sélectionnées - *Approximation*
    tabIconSelected: "#FFFFFF",  // Icônes de navigation sélectionnées (souvent blanches ou Blurple si l'icône change de couleur)

    // Couleurs spécifiques du thème sombre (issues de recherches communautaires)
    profile_background_banner_hidden: "#111214", // Utilisé pour le fond du profil si la bannière est masquée
    message_highlight_hw_accel_on: "#242428",    // Surlignage de message (accélération matérielle activée)
    message_highlight_hw_accel_off: "#232328",   // Surlignage de message (accélération matérielle désactivée)

    // Autres couleurs de la marque Discord
    yellow: "#FEE75C",
    fuchsia: "#c95a22",
    validatedGreen:"#2d6d48",
    redIcon: "#fb3e42", 
    greyple: "#99aab5", 
  },

};
