import { describe, it, expect } from 'vitest'
import { createTask, addTask, deleteTask } from '../src/tasks.js'

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
})

describe('addTask', () => {
  it('devrait ajouter une tâche à la liste', () => {
    const tasks = []
    const newTask = createTask('Test')

    const result = addTask(tasks, newTask)

    expect(result).toHaveLength(1)
    expect(result[0].text).toBe('Test')
  })

  it('ne doit pas modifier le tableau original (immutabilité)', () => {
    const tasks = [createTask('A')]
    const newTask = createTask('B')

    const result = addTask(tasks, newTask)

    expect(result).toHaveLength(2)
    expect(tasks).toHaveLength(1) // original inchangé
    expect(result).not.toBe(tasks) // nouveau tableau
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

  it('ne doit pas modifier le tableau original (immutabilité)', () => {
    const t1 = createTask('A')
    const t2 = createTask('B')
    const tasks = addTask(addTask([], t1), t2)

    const result = deleteTask(tasks, t1.id)

    expect(tasks).toHaveLength(2)     // original inchangé
    expect(result).toHaveLength(1)    // nouveau tableau
    expect(result).not.toBe(tasks)    // pas la même référence
  })
})