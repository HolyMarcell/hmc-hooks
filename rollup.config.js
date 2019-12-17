import babel from 'rollup-plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import localResolve from 'rollup-plugin-local-resolve';
import typescript from "rollup-plugin-typescript2";
import dts from 'rollup-plugin-dts';

import pkg from './package.json';

const config = [
  {
    input: 'src/index.ts',

    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    external: [
      'react',
      'react-dom',
      'redux',
      'react-redux'
    ],
    plugins: [
      typescript(),
      peerDepsExternal(),
      // builtins(),
      babel({exclude: 'node_modules/**'}),
      localResolve(),
      resolve(),
      commonjs(),
      filesize(),
    ],
  },
  {
    input: "src/types.d.ts",
    output: [{file: "dist/types.d.ts", format: "es"}],
    plugins: [dts()],
  },

];

export default config;
