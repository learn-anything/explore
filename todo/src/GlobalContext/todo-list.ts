import {
  batch,
  createContext,
  useContext,
  createMemo,
  createSelector,
  createSignal,
  untrack,
  Signal,
  onMount,
} from "solid-js"
import {
  ClientSubtask,
  ClientTodo,
  TodoKey,
  createTodosState,
  getNewKey,
} from "./todos"
import { todayDate } from "~/lib/lib"
import { SetterParam } from "@solid-primitives/utils"

export type { ClientSubtask, ClientTodo } from "./todos"

export type NewSubtask = {
  type: "new-subtask"
  parent: TodoKey
  key: TodoKey
}

export enum PageType {
  All = "All",
  Today = "Today",
  Done = "Done",
  Starred = "Starred",
  Filtered = "Filtered",
}

export enum TodoListMode {
  Default,
  Edit,
  NewTodo,
  NewSubtask,
  Search,
  Suggest,
  Settings,
  Filtered,
}

type TodoListModeDataMap = {
  [TodoListMode.Settings]: { settingsState?: string }
  [TodoListMode.NewSubtask]: NewSubtask
  [TodoListMode.Edit]: { initEditingNote?: true }
  [TodoListMode.Search]: Signal<
    | {
        isResult(key: TodoKey): boolean
        isSelected(key: TodoKey): boolean
      }
    | undefined
  >
}

export type TodoListModeData<T extends TodoListMode> =
  T extends keyof TodoListModeDataMap ? TodoListModeDataMap[T] : void

type TodoListModeState = {
  [K in TodoListMode]: { type: K } & (K extends keyof TodoListModeDataMap
    ? { data: TodoListModeDataMap[K] }
    : { data?: undefined })
}[TodoListMode]

export function createTodoListState(
  options: Parameters<typeof createTodosState>[0]
) {
  const todosState = createTodosState(options)

  const [activePage, setActivePage] = createSignal(PageType.All)
  const [onBoarding, setOnBoarding] = createSignal<1 | 2 | 3 | 4 | 5 | null>(1)
  const [selectedTagInSidebar, setSelectedTagInSidebar] = createSignal("")
  const [newTag, setNewTag] = createSignal(false)
  const [searchTags, setSearchTags] = createSignal(false)
  const [focusedTodoKey, setFocusedTodoKey] = createSignal<TodoKey | null>(null)
  const isTodoFocused = createSelector<TodoKey | null, TodoKey>(focusedTodoKey)

  const [modeState, _setMode] = createSignal<TodoListModeState>(
    { type: TodoListMode.Default },
    { equals: (a, b) => a.type === b.type && a.data === b.data }
  )
  const setMode = <T extends TodoListMode>(
    ..._: T extends keyof TodoListModeDataMap
      ? [mode: T, data: TodoListModeDataMap[T]]
      : [mode: T]
  ) => _setMode({ type: _[0], data: _[1] } as any)

  const mode = createMemo(() => modeState().type)
  const inMode = createSelector<TodoListMode, TodoListMode>(
    () => modeState().type
  )
  const getModeData = <T extends TodoListMode>(mode: T) =>
    inMode(mode) ? (modeState().data as TodoListModeData<T>) : undefined

  function addNewTask() {
    batch(() => {
      setMode(TodoListMode.NewTodo)
      setFocusedTodoKey(null)
    })
  }

  // TODO: there might be a better way to do it..
  const [inTauri, setInTauri] = createSignal(false)
  onMount(() => {
    // @ts-ignore
    if (window.__TAURI__ !== undefined) {
      setInTauri(true)
    }
  })

  function addNewSubtask(): void {
    const key = getNewKey()
    const focused = focusedTodo()
    if (!focused) return
    batch(() => {
      setMode(TodoListMode.NewSubtask, {
        parent: focused.type === "subtask" ? focused.parent.key : focused.key,
        key,
        type: "new-subtask",
      })
      setFocusedTodoKey(key)
    })
  }

  const compareTodos = (a: ClientTodo, b: ClientTodo): number => {
    if (b.starred && !a.starred) {
      return 1
    } else if (a.starred && !b.starred) {
      return -1
    }
    return b.priority - a.priority
  }

  const filterPredicateMap: Record<PageType, (t: ClientTodo) => boolean> = {
    [PageType.All]: (t) => !t.done,
    [PageType.Today]: (t) => !t.done && t.dueDate === todayDate(),
    [PageType.Done]: (t) => t.done,
    [PageType.Starred]: (t) => !t.done && t.starred,
    [PageType.Filtered]: (t) =>
      !!t.tags && t.tags!.includes(selectedTagInSidebar()),
  }

  const orderedTodos = createMemo(() =>
    todosState.todos.filter(filterPredicateMap[activePage()]).sort(compareTodos)
  )

  const flatTasks = createMemo(() =>
    orderedTodos()
      .map((t) => {
        const list: (NewSubtask | ClientSubtask | ClientTodo)[] = [
          t,
          ...t.subtasks,
        ]
        const ns = getModeData(TodoListMode.NewSubtask)
        if (ns?.parent === t.key) list.push(ns)
        return list
      })
      .flat()
  )

  // TODO: make sure memo runs no more than needed..
  // list containing all unique tag names used + the count
  const currentlyUsedTagsWithCount = createMemo(() => {
    let uniqueTagsWithCount = new Map<string, number>()
    todosState.todos.map((t) => {
      if (t.tags) {
        t.tags.forEach((tag) => {
          if (uniqueTagsWithCount.has(tag)) {
            uniqueTagsWithCount.set(tag, uniqueTagsWithCount.get(tag)! + 1)
          } else {
            uniqueTagsWithCount.set(tag, 1)
          }
        })
      }
    })
    return uniqueTagsWithCount
  })

  function getTodoByKey(
    key: TodoKey
  ): NewSubtask | ClientSubtask | ClientTodo | undefined {
    return flatTasks().find((t) => t.key === key)
  }

  const focusedTodoIndex = createMemo(() =>
    flatTasks().findIndex((t) => t.key === focusedTodoKey())
  )

  function setFocusedTodoIndex(index: SetterParam<number>) {
    const todo =
      flatTasks()[
        typeof index === "function" ? index(focusedTodoIndex()) : index
      ]
    if (todo) setFocusedTodoKey(todo.key)
  }

  const focusedTodo = createMemo<
    NewSubtask | ClientTodo | ClientSubtask | undefined
  >(() => flatTasks()[focusedTodoIndex()])

  const getTodoIndex = (todo: ClientTodo): number => {
    return todosState.todos.findIndex((t) => t.key === todo.key)
  }

  return {
    request: options.request,
    todosState,
    getTodoIndex,
    flatTasks,
    // all the todosState state and methods can be available top level
    ...todosState,
    activePage,
    updateActivePage(page: PageType) {
      if (page === untrack(activePage)) return

      batch(() => {
        setActivePage(page)
        setFocusedTodoIndex(0)
      })
    },
    orderedTodos,
    focusedTodo,
    currentlyUsedTagsWithCount,
    focusedTodoKey,
    focusedTodoIndex,
    getTodoByKey,
    isTodoFocused,
    setFocusedTodoKey,
    setFocusedTodoIndex,
    selectedTagInSidebar,
    setSelectedTagInSidebar,
    mode,
    getModeData,
    inMode,
    setMode,
    addNewTask,
    addNewSubtask,
    newTag,
    setNewTag,
    inTauri,
    onBoarding,
    searchTags,
    setSearchTags,
    setOnBoarding,
    localSearchData: createMemo(() => getModeData(TodoListMode.Search)?.[0]()),
    startLocalSearch() {
      batch(() => {
        setMode(TodoListMode.Search, createSignal(undefined))
        setFocusedTodoKey(null)
      })
    },
  } as const
}

const TodoListCtx = createContext<ReturnType<typeof createTodoListState>>()

export const TodoListProvider = TodoListCtx.Provider

export const useTodoList = () => {
  const ctx = useContext(TodoListCtx)
  if (!ctx) throw new Error("useTodoList must be used within TodoListProvider")
  return ctx
}
