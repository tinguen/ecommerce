module.exports = {
  purge: ['./client/**/*.html', './client/**/*.jsx', './client/**/*.js'],
  theme: {
    extend: {
      transformOrigin: {
        '1': '1px'
      },
      margin: {
        '7': '1.75rem'
      },
      zIndex: {
        '-10': '-10'
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
        size: 'height, width, margin, padding'
      }
    }
  },
  variants: {
    borderStyle: ['responsive', 'hover', 'focus']
  },
  plugins: []
}
