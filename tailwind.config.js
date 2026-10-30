// As cores e o raio vêm do config.json do cliente ativo (variável CLIENT),
// o mesmo arquivo que o app.config.js usa. Assim cada cliente tem suas cores
// e os componentes só usam nomes: bg-primary, text-muted, rounded-brand...
// Ao trocar de cliente, rode o Metro com --clear (os scripts start:* já fazem).
const path = require("node:path");

const client = process.env.CLIENT || "movva";
const { theme } = require(path.join(__dirname, "clients", client, "config.json"));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: theme.primary,
        "primary-text": theme.primaryText,
        background: theme.background,
        surface: theme.surface,
        text: theme.text,
        muted: theme.muted,
      },
      fontSize: {
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
        "4xl": "36px",
      },
      height: {
        button: 57,
      },
      borderRadius: {
        brand: `${theme.radius}px`,
      },
    },
  },
  plugins: [],
};
