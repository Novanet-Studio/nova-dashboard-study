// TailwindCSS configuration file

module.exports = {
  theme: {},
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layout/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ]
  }
}