# Mood Moodboard ✨

**Mood Moodboard** is a tactical inspiration tool designed to break creative blocks. It blends procedural generation with manual refinement, allowing creators to discover unique aesthetic "vibe" combinations—ranging from "Aggressive Noodle" to "Suspiciously Radiant"—for their design projects, brand identities, or digital scrapbooks.

---

## 🌟 Core Features

### 1. Generative "Hallucination" Engine
The heart of the app is a randomization logic that pairs HSL-based vibrant color palettes with a curated library of 50+ expressive emojis and a humorous semantic title generator.

### 2. The "Lock & Remix" Workflow
Total chaos isn't always helpful. Users can lock individual colors, the title, or specific emojis. Subsequent "shuffles" only replace the unlocked elements, allowing for iterative refinement of a specific aesthetic direction.

### 3. Tactile Sensory Feedback
Leveraging the **Web Audio API**, the app features a custom synthesizer. Locking an item triggers a high-frequency (950Hz) "pop," while unlocking provides a lower (550Hz) release tone. This provides immediate, non-visual confirmation of state changes.

### 4. Direct Composition Control
*   **Native Drag & Drop:** Reorder color bars or emoji tiles instantly to change the visual weight of the board.
*   **Search & Filter:** Narrow down the emoji pool by category (Food, Nature, Vibes, etc.) or specific keywords.

### 5. High-Fidelity Exports
Export your boards as high-quality PNG or JPG files. The app uses a custom DOM-filtering logic during capture to strip away UI elements (buttons, lock icons, handles), resulting in a clean, professional-looking design asset.

---

## 🛠️ Technical Deep Dive

### The Color Algorithm
To avoid "muddy" or unappealing palettes, we don't use pure RGB randomization. Instead, we generate colors in the **HSL (Hue, Saturation, Lightness)** space:
- **Hue:** 0–360 (Full spectrum)
- **Saturation:** 60%–90% (Ensures vibrancy)
- **Lightness:** 40%–60% (Maintains readability and prevents "washed out" colors)

### Tech Stack
- **Framework:** React 19 (utilizing `useMemo` for performance and `useRef` for DOM capture).
- **Styling:** Tailwind CSS with custom JIT animations (Float, Blob-Drift).
- **Audio:** Web Audio API (real-time OscillatorNode synthesis).
- **Icons:** Lucide React for accessible, crisp vector graphics.
- **Exporting:** `html-to-image` for client-side canvas rendering.

---

## 📂 Project Structure

- `App.tsx`: The primary state container and UI layout.
- `services/moodGenerator.ts`: The logic for HSL colors and semantic title pairing.
- `services/audioService.ts`: A singleton class managing the Web Audio Context and oscillators.
- `constants.ts`: The curated library of Emojis and Title adjectives/nouns.
- `types.ts`: TypeScript interfaces for the MoodState and SavedMood entities.
- `index.html`: Base template with Tailwind and Google Fonts (Plus Jakarta Sans).

---

## 🎨 UX Philosophy: "Digital Tactility"
The design follows a **Glass-morphism** aesthetic. The board is semi-transparent, allowing a blurred "Lava Lamp" background to peek through. This background is not static; it consists of four floating SVG blobs that mirror the board's current palette, creating a cohesive, immersive environment that shifts every time you hit "Shuffle."

---

## 🚀 Roadmap
- [ ] **AI-Powered Vibe Descriptions:** Generate short, poetic descriptions of the current mood.
- [ ] **Shared History:** A community gallery where users can post their favorite "hallucinations."
- [ ] **Palette Export:** Export specific colors as ASE (Adobe Swatch Exchange) or CSS variable files.
- [ ] **Interactive Soundscapes:** Generative ambient music that changes frequency based on the current palette's brightness.

---

Built with 💖 for the creative community. Pure vibes only.