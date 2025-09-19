import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

import oklab from '@csstools/postcss-oklab-function';
// import oklch from '@csstools/postcss-oklch-function';
import colorFunc from 'postcss-color-functional-notation';
import hexAlpha from 'postcss-color-hex-alpha';

export default {
  plugins: [
    tailwind(),

    oklab({ preserve: true }),
    // oklch({ preserve: true }),

    colorFunc({ preserve: true }),
    hexAlpha({ preserve: true }),

    autoprefixer(),
  ],
};
