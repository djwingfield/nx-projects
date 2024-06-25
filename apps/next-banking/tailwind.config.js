const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const shadCnTailwindConfig = require('../../libs/shared/shadcn/ui/src/lib/styles/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [shadCnTailwindConfig],
};
