import { ref, watch } from 'vue'
import { getNameFromId } from '@/utils/nameTranslation'

/**
 * Returns a reactive `name` ref that always tracks the given userId.
 * If userId changes, it re-fetches the name.
 */
export function useUserName(userIdGetter: () => number) {
  const name = ref<string>('')

  // whenever the getter returns a new ID, re-run getNameFromId
  watch(
    userIdGetter,
    async (newId) => {
      if (newId != null) {
        name.value = await getNameFromId(newId)
      } else {
        name.value = ''
      }
    },
    { immediate: true },
  )

  return name
}
