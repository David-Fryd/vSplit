import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // TODO: Add local fonts after getting licensing/permission for them
        // vedst: ["var(--font-edst)"],
        // veram: ["var(--font-eram)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
