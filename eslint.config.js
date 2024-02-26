import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'dist',
  ],
}, {
  rules: {
    'ts/ban-ts-comment': 0,
  },
})
