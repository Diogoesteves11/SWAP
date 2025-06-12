/**
 * Looks up a user ID by email address.
 * Searches /students first, then /teachers.
 *
 * @param email the email address to look up
 * @returns the numeric userId, or null if not found
 */
export async function getIdByEmail(email: string): Promise<number | null> {
  // try students
  let res = await fetch(`http://localhost:3000/students?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error(`Failed to query students: ${res.status}`)
  let data = await res.json()
  if (data.length) {
    return data[0].id
  }

  // try teachers
  res = await fetch(`http://localhost:3000/teachers?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error(`Failed to query teachers: ${res.status}`)
  data = await res.json()
  if (data.length) {
    return data[0].id
  }

  if (email === '1021@di.uminho.pt') return 1021

  return null
}

/**
 * Looks up a user email by ID.
 * Tries /students/:id, then /teachers/:id.
 *
 * @param id the user ID to look up
 * @returns the email string, or null if not found
 */
export async function getEmailById(id: number): Promise<string | null> {
  // try students
  let res = await fetch(`http://localhost:3000/students/${id}`)
  if (res.ok) {
    const stu = await res.json()
    if (stu && stu.email) return stu.email
  }

  // try teachers
  res = await fetch(`http://localhost:3000/teachers/${id}`)
  if (res.ok) {
    const tch = await res.json()
    if (tch && tch.email) return tch.email
  }

  if (id === 1021) return '1021@di.uminho.pt'

  return null
}
