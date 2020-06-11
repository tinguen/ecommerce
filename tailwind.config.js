module.exports = {
  purge: ['./client/**/*.html', './client/**/*.jsx', './client/**/*.js'],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.5rem'
      },
      inset: {
        '-2': '-0.5rem',
        '-3': '-0.75rem',
        '4': '1rem',
        '25': '6.25rem'
      },
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
      },
      maxHeight: {
        '3/4': '75vh'
      }
    }
  },
  variants: {
    borderStyle: ['responsive', 'hover', 'focus']
  },
  plugins: []
}
