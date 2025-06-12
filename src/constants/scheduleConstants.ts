import { parseTime, differenceInMinutes } from '@/utils/time'

export const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
export const DAY_START = parseTime('08:00')
export const DAY_END = parseTime('21:00')
export const DAY_DURATION_MINUTES = differenceInMinutes(DAY_START, DAY_END)
export const NUM_HOURS = DAY_DURATION_MINUTES / 60
