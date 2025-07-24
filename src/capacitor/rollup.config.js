import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

// Define base directory
const rootDir = path.resolve(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');

export default {
    // Use absolute paths to avoid resolution issues
    input: path.join(distDir, 'esm/index.js'),
    output: [
        {
            file: path.join(distDir, 'plugin.js'),
            format: 'iife',
            name: 'capacitorIntentShim',
            globals: {
                '@capacitor/core': 'capacitorExports',
            },
            sourcemap: true,
            inlineDynamicImports: true,
        },
        {
            file: path.join(distDir, 'plugin.cjs.js'),
            format: 'cjs',
            sourcemap: true,
            inlineDynamicImports: true,
        },
    ],
    plugins: [
        nodeResolve(),
        commonjs(),
    ],
    external: ['@capacitor/core'],
};