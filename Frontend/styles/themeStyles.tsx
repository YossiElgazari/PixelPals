export const colors = {
    primary: '#d101fd',   // Vivid purple
    secondary: '#05d6ff', // Bright cyan
    background: '#0e0e10', // Almost black, great for dark themes
    surface: '#1f1f23',    // Dark grey for UI elements background
    textPrimary: '#ffffff', // White text for high contrast on dark backgrounds
    textSecondary: '#a1a1a4', // Light grey text for less emphasis
    error: '#ff3333', // Bright red for errors or warnings
    success: '#4caf50', // Green for success messages or icons
  };
  
  export const textStyles = {
    headline: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    body: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    button: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
    },
  };
  
  export const containerStyles = {
    fullScreen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centeredContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    paddingMedium: {
      padding: 20,
    },
    marginMedium: {
      margin: 20,
    },
  };
  
  export const buttonStyles = {
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 5,
      marginVertical: 10,
    },
    secondaryButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 5,
      marginVertical: 10,
    },
    textButton: {
      ...textStyles.button,
      paddingVertical: 10,
    },
  };
  