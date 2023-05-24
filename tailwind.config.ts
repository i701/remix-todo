// import type { Config } from "tailwindcss"
const withMT = require("@material-tailwind/react/utils/withMT")
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = withMT({
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
})

// export default {
//   content: ['./app/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["Space Grotesk", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config
