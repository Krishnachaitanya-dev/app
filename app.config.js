import 'dotenv/config';

export default ({ config }) => {
  // Log environment variables for debugging (remove in production)
  console.log('Environment variables loaded:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set');
  
  return {
    ...config,
    name: "Laundry Service",
    slug: "laundry-service",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.laundryservice"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.laundryservice"
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://wxfunpkohhtgqjrslmqv.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZnVucGtvaGh0Z3FqcnNsbXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDAyMDksImV4cCI6MjA2MDQ3NjIwOX0.ELZPKt0ZcP08_t2gOxadet54UJ6FQnB3ac-ovm1WypQ',
      eas: {
        projectId: process.env.EAS_PROJECT_ID || "your-project-id",
      },
    },
  };
};