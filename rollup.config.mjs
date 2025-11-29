import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import legacy from '@rollup/plugin-legacy';

import copy from 'rollup-plugin-copy';

export default [
  {
    input: 'src/module.js',
    output: {
      file: 'ds-reskinner.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      legacy({
        'modern': true
      }),
      resolve(),
      commonjs(),
      copy({
        targets: [
          { src: 'src/styles.css', dest: 'css', rename: 'module.css' },
          { src: 'templates/*', dest: 'templates' },
          { src: 'lang/*', dest: 'lang' }
        ]
      })
    ],
    watch: {
      clearScreen: false
    },
    external: ['foundry']
  }
];
