// js
import globals from 'rollup-plugin-node-globals'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import vue from 'rollup-plugin-vue'

// css
import postcss from 'rollup-plugin-postcss'
import cssnext from 'postcss-cssnext'
import postcssVars from './src/css/variables.js'
import postcssNested from 'postcss-nested'

// development
import serve from 'rollup-plugin-serve'

// production
import uglify from 'rollup-plugin-uglify'

const sourcePath = 'src/'
const distPath = 'dist/'
const assetsPath = distPath + 'assets/'

let plugins = [
  globals(),
  resolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonjs(),
  // nodeGlobals(),
  postcss({
    plugins: [
      cssnext({
        features: {
          customProperties: {
            variables: postcssVars
          }
        }
      }),
      postcssNested()
    ],
    extensions: ['.css']
  }),
  vue({
    compileTemplate: true,
    css: assetsPath + 'css/bundle.css'
  }),
  buble()
]

let config = {
  name: 'SOLIDEVOLUTION',
  input: sourcePath + 'main.js',
  output: {
    file: assetsPath + 'js/bundle.js',
    format: 'iife'
  },
  sourcemap: true,
  plugins: plugins
}

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

if (isProduction) {
  config.sourcemap = false
  config.plugins.push(uglify())
}

if (isDevelopment) {
  config.plugins.push(serve({
    contentBase: distPath,
    port: 8080
  }))
}

export default config
