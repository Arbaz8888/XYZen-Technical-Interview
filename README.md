# 🎧 Music Discovery App

A sleek mobile app built with **React Native + Expo**, designed for users and artists to **discover**, **upload**, and **share** music videos — with role-based access, clean UI, and genre-based organization.

---
## [Demo Video](https://www.youtube.com/watch?v=6rtK-YmdHvM)

## 🚀 Features

### 🔐 Authentication
- 🔑 Hardcoded demo login for **Users** and **Artists**
- 🔒 Role-based access to features
- ✅ Secure video uploads using Supabase

### 📰 Feed
- 🎥 Public video feed for both users and artists
- 🔁 Autoplay with scroll-based visibility
- ❤️ Like | 💬 Comment (modal) | 🔗 Share (stub)

### 📁 Collections
- 👤 **Users**: Private collections (only visible to themselves)
- 👨‍🎤 **Artists**: Public collections viewable by all
- 🎬 Upload videos by genre, title, and caption
- 🧩 Grouped display by genre with horizontal scrolling

### 👤 Profile
- Shows logged-in user’s name, role, and description
- Minimalist layout, styled by user/artist type

---

## 🛠️ Built With

- ✅ [React Native + Expo](https://docs.expo.dev/)
- ✅ [Supabase](https://supabase.com/) (Postgres + Storage)
- ✅ [Expo AV](https://docs.expo.dev/versions/latest/sdk/video/) for video playback
- ✅ [FileSystem + ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- ✅ TypeScript (with modular folders & reusable components)

---

## 🧱 Project Structure

📁 app/ ├── (tabs)/ # Tab screens: feed, collections, profile ├── context/ # Auth context (login state & role mgmt) ├── styles/ # All centralized style files └── supabaseClient.ts # Supabase setup (env-secured)

📄 App.tsx / index.tsx # Entry points (redirects based on login)


---

## 🎮 Demo Accounts

Login as an **artist** or **user** to explore different experiences:

### 👨‍🎤 Artist Accounts
- `artist1` / `password123`
- `artist2` / `password123`

### 👤 User Accounts
- `user1` / `password123`
- `user2` / `password123`
