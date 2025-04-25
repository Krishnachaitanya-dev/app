# Laundry Service Mobile App

A React Native mobile application for a laundry service business, built with Expo and Supabase.

## Features

- User authentication (signup, login, profile management)
- Service browsing and ordering
- Order tracking and history
- Address management
- Payment method management
- Notifications
- Customer support

## Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Supabase (Authentication, Database, Storage)
- **UI Components**: Custom components with React Native StyleSheet

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Supabase account

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/laundry-service-app.git
cd laundry-service-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

4. Start the development server:
```bash
npm start
```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL script in `supabase/schema.sql` to set up the database schema
3. Configure authentication settings in the Supabase dashboard
4. Set up storage buckets for user avatars and service images

## Project Structure

```
/app                    # Application screens (Expo Router)
  /(auth)               # Authentication screens
  /(tabs)               # Main tab navigation
  /order                # Order flow screens
  /profile              # Profile management screens
  /support              # Support screens
/assets                 # Static assets
/components             # Reusable UI components
/constants              # Application constants
/hooks                  # Custom React hooks
/mocks                  # Mock data for development
/services               # API services for Supabase
/store                  # Zustand state stores
/styles                 # Shared styles
/types                  # TypeScript type definitions
/supabase               # Supabase related files
```

## Deployment

### Expo EAS Build

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

3. Configure EAS build:
```bash
eas build:configure
```

4. Create a production build:
```bash
# For iOS
eas build --platform ios --profile production

# For Android
eas build --platform android --profile production
```

5. Submit to app stores:
```bash
# For iOS
eas submit --platform ios

# For Android
eas submit --platform android
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.