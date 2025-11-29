import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
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
      resolve(),
      commonjs(),
      copy({
        targets: [
          { src: 'src/styles.css', dest: 'css', rename: 'module.css' }
        ]
      })
    ],
    watch: {
      clearScreen: false
    },
    external: ['foundry']
  }
];
