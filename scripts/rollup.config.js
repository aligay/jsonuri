const typescript = require('rollup-plugin-typescript2')

module.exports = {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'jsonuri'
  },
  plugins: [
    typescript({
      verbosity: 2,
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          target: 'es5',
          sourceMap: true
        }
      },
      inlineSourceMap: true,
      sourceMap: true,
      useTsconfigDeclarationDir: true
    })
  ]
}
