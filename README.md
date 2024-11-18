# Camber Bikes Bike Fitting App

A mobile application built with React Native and Expo for bike fitting and saddle adjustment. Built for the "Silicon Valley IT Talent Program 2024" by Team "Camber Bikes".

## Releases
For prebuilt APKs, please check out the [Releases page](https://github.com/camber-bikes/bike-fitting-app/releases).

## Prerequisites
Before you begin, ensure you have installed:
- [Bun](https://bun.sh) (latest version)
- iOS Simulator (Mac only) or Android Studio (for Android emulator)

## Development
1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun run android  # Android Development
bun run ios      # iOS Development
bun run start --tunnel  # Development through Expo GO
```

## Environment Setup
The API URL the app uses is defined in `constants/Api.ts`. For development or if you host your own instance, change it to your own base URL.

## Building
For building packages, we use EAS:
- Create a Preview APK for Android using the EAS cloud service:
```bash
bunx eas-cli build --platform android --profile preview
```

## Key Technologies
- React & React Native
- Expo SDK 52 with Expo Router 4.0
- UI Kitten & React Native Paper
- Expo Camera & AV for media handling
- React Native MMKV for storage/cache
- React Native Reanimated & Gesture Handler
- TypeScript for development
- React Navigation
- Expo Vector Icons & SVG support
- Full iOS & Android platform support

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`git commit -m 'feat(scope): what did you change'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the AGPLv3 License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by Camber Bikes