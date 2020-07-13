import { rgba } from 'polished'

export const colors = {
  primary: '#102030',
  wash: '#f5f7f9',

  beacon: {
    focus: 'rgb(68, 136, 221)',
  },

  border: {
    field: '#e0e8ec',
  },

  text: {
    alt: '#607080',
    default: '#333b44',
  },
}

export const shadows = {
  beacon: (color = colors.beacon.focus) => `0 0 0px 2px ${color}`,
  drop: (color = 'rgba(0, 0, 0, 0.02)') =>
    `${color} 0px 0px 4px 2px, ${color} 0px 0px 2px 0px`,
  sunk: (color = colors.primary) => `${rgba(color, 0.03)} 2px 2px 2px inset`,
}
