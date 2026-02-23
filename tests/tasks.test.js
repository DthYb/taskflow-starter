/**
 * Tests pour le module tasks.js
 * Objectif : coverage >= 70% (dont functions)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateId,
  loadTasks,
  saveTasks,
  createTask,
  addTask,
  deleteTask,
  toggleTask,
  filterTasks,
  clearCompleted,
  countTasks,
  sortByPriority,
} from '../src/tasks.js'

// Mock localStorage (simple + contrôlable)
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => {
      store[key] = String(value)
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    // helper (pas utilisé par le code, mais utile en test)
    __getStore: () => store,
  }
})()

beforeEach(() => {
  vi.restoreAllMocks()
  // Remettre le mock en place avant chaque test
  globalThis.localStorage = localStorageMock
  localStorageMock.clear()
})

describe('generateId', () => {
  it('devrait retourner une string', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(5)
  })

  it('devrait générer des ids différents', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })
})

describe('loadTasks / saveTasks', () => {
  it('loadTasks devrait retourner [] si aucune donnée', () => {
    const tasks = loadTasks()
    expect(tasks).toEqual([])
    expect(localStorage.getItem).toHaveBeenCalled()
  })

  it('loadTasks devrait parser les tâches depuis le localStorage', () => {
    const data = [{ id: '1', text: 'A', completed: false, priority: 'low', createdAt: 'x' }]
    localStorage.setItem('taskflow-tasks', JSON.stringify(data))

    const tasks = loadTasks()
    expect(tasks).toEqual(data)
  })

  it('loadTasks devrait retourner [] si JSON invalide (catch)', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
    localStorage.setItem('taskflow-tasks', '{invalid-json')

    const tasks = loadTasks()
    expect(tasks).toEqual([])
    expect(errSpy).toHaveBeenCalled()
  })

  it('saveTasks devrait écrire dans le localStorage', () => {
    const data = [{ id: '1', text: 'A', completed: false, priority: 'low', createdAt: 'x' }]
    saveTasks(data)

    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledWith('taskflow-tasks', JSON.stringify(data))
  })

  it('saveTasks devrait gérer les erreurs (catch)', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
    // Force une erreur
    localStorage.setItem.mockImplementationOnce(() => {
      throw new Error('boom')
    })

    expect(() => saveTasks([{ id: '1' }])).not.toThrow()
    expect(errSpy).toHaveBeenCalled()
  })
})

describe('createTask', () => {
  it('devrait créer une tâche avec les propriétés par défaut', () => {
    const task = createTask('Ma nouvelle tâche')

    expect(task).toHaveProperty('id')
    expect(task.text).toBe('Ma nouvelle tâche')
    expect(task.priority).toBe('medium')
    expect(task.completed).toBe(false)
    expect(task).toHaveProperty('createdAt')
  })

  it('devrait créer une tâche avec une priorité personnalisée', () => {
    const task = createTask('Tâche urgente', 'high')
    expect(task.priority).toBe('high')
  })

  it('devrait trim le texte', () => {
    const task = createTask('   Hello   ')
    expect(task.text).toBe('Hello')
  })

  it('devrait ajouter un timestamp createdAt valide (ISO parsable)', () => {
    const task = createTask('Timed')
    const parsed = Date.parse(task.createdAt)
    expect(typeof task.createdAt).toBe('string')
    expect(Number.isNaN(parsed)).toBe(false)
  })

  it('devrait lancer une erreur si le texte est vide', () => {
    expect(() => createTask('')).toThrow()
  })

  it('devrait lancer une erreur si le texte contient seulement des espaces', () => {
    expect(() => createTask('   ')).toThrow()
  })

  it('devrait lancer une erreur si le texte est null', () => {
    expect(() => createTask(null)).toThrow()
  })

  it('devrait lancer une erreur si le texte est undefined', () => {
    expect(() => createTask(undefined)).toThrow()
  })

  it('devrait lancer une erreur si la priorité est invalide', () => {
    expect(() => createTask('Test', 'urgent')).toThrow()
  })
})

describe('addTask', () => {
  it('devrait ajouter une tâche à une liste vide', () => {
    const tasks = []
    const newTask = createTask('Test')

    const result = addTask(tasks, newTask)

    expect(result).toHaveLength(1)
    expect(result[0].text).toBe('Test')
  })

  it('devrait ajouter une tâche à une liste non vide', () => {
    const t1 = createTask('A')
    const t2 = createTask('B')
    const tasks = addTask([], t1)

    const result = addTask(tasks, t2)

    expect(result).toHaveLength(2)
    expect(result[0].text).toBe('A')
    expect(result[1].text).toBe('B')
  })

  it('ne doit pas modifier le tableau original (immutabilité)', () => {
    const tasks = [createTask('A')]
    const newTask = createTask('B')

    const result = addTask(tasks, newTask)

    expect(result).toHaveLength(2)
    expect(tasks).toHaveLength(1)
    expect(result).not.toBe(tasks)
  })
})

describe('deleteTask', () => {
  it('devrait supprimer une tâche par id', () => {
    const t1 = createTask('A')
    const t2 = createTask('B')
    const tasks = addTask(addTask([], t1), t2)

    const result = deleteTask(tasks, t1.id)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(t2.id)
  })

  it("si l'id n'existe pas, la liste doit rester identique", () => {
    const t1 = createTask('A')
    const tasks = addTask([], t1)

    const result = deleteTask(tasks, 'id-inexistant')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(t1.id)
  })

  it('supprimer sur une liste vide doit renvoyer une liste vide', () => {
    expect(deleteTask([], 'nimporte')).toEqual([])
  })
})

describe('toggleTask', () => {
  it('devrait basculer completed pour la tâche ciblée', () => {
    const t1 = { ...createTask('A'), completed: false }
    const t2 = { ...createTask('B'), completed: false }
    const tasks = [t1, t2]

    const result = toggleTask(tasks, t1.id)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(t1.id)
    expect(result[0].completed).toBe(true)
    expect(result[1].completed).toBe(false)
  })

  it("si l'id n'existe pas, rien ne change (mais nouvelle liste)", () => {
    const t1 = { ...createTask('A'), completed: false }
    const tasks = [t1]

    const result = toggleTask(tasks, 'missing')

    expect(result).toEqual(tasks)
    expect(result).not.toBe(tasks)
  })
})

describe('filterTasks', () => {
  it('filtre active', () => {
    const tasks = [
      { ...createTask('A'), completed: false },
      { ...createTask('B'), completed: true },
    ]
    const result = filterTasks(tasks, 'active')
    expect(result).toHaveLength(1)
    expect(result[0].completed).toBe(false)
  })

  it('filtre completed', () => {
    const tasks = [
      { ...createTask('A'), completed: false },
      { ...createTask('B'), completed: true },
    ]
    const result = filterTasks(tasks, 'completed')
    expect(result).toHaveLength(1)
    expect(result[0].completed).toBe(true)
  })

  it('filtre all (retourne la même liste)', () => {
    const tasks = [{ ...createTask('A'), completed: false }]
    const result = filterTasks(tasks, 'all')
    expect(result).toBe(tasks) // ton code renvoie tasks directement
  })

  it('filtre inconnu => default => tasks', () => {
    const tasks = [{ ...createTask('A'), completed: false }]
    const result = filterTasks(tasks, 'weird')
    expect(result).toBe(tasks)
  })
})

describe('clearCompleted', () => {
  it('devrait retirer toutes les tâches completed', () => {
    const tasks = [
      { ...createTask('A'), completed: false },
      { ...createTask('B'), completed: true },
      { ...createTask('C'), completed: false },
    ]
    const result = clearCompleted(tasks)
    expect(result).toHaveLength(2)
    expect(result.every((t) => !t.completed)).toBe(true)
  })
})

describe('countTasks', () => {
  it('devrait compter total/active/completed', () => {
    const tasks = [
      { ...createTask('A'), completed: false },
      { ...createTask('B'), completed: true },
      { ...createTask('C'), completed: true },
    ]
    const stats = countTasks(tasks)
    expect(stats).toEqual({ total: 3, active: 1, completed: 2 })
  })

  it('devrait retourner des zéros si liste vide', () => {
    expect(countTasks([])).toEqual({ total: 0, active: 0, completed: 0 })
  })
})

describe('sortByPriority', () => {
  it('devrait trier high > medium > low', () => {
    const low = { ...createTask('Low', 'low') }
    const high = { ...createTask('High', 'high') }
    const med = { ...createTask('Med', 'medium') }

    const tasks = [low, med, high]
    const result = sortByPriority(tasks)

    expect(result[0].priority).toBe('high')
    expect(result[1].priority).toBe('medium')
    expect(result[2].priority).toBe('low')
  })

  it('ne doit pas modifier le tableau original (immutabilité)', () => {
    const t1 = { ...createTask('A', 'low') }
    const t2 = { ...createTask('B', 'high') }
    const tasks = [t1, t2]

    const result = sortByPriority(tasks)

    expect(result).not.toBe(tasks)
    expect(tasks[0].id).toBe(t1.id) // original inchangé
  })
})