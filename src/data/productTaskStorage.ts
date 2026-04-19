import { mockProductTasks } from "./mockProductTasks";
import type { ProductTaskRecord } from "../types";

const PRODUCT_TASKS_STORAGE_KEY = "product_tasks";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function persistProductTasks(tasks: ProductTaskRecord[]) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(PRODUCT_TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

export function readProductTasks(): ProductTaskRecord[] {
  if (!canUseLocalStorage()) {
    return mockProductTasks;
  }

  const storedValue = window.localStorage.getItem(PRODUCT_TASKS_STORAGE_KEY);

  if (!storedValue) {
    persistProductTasks(mockProductTasks);
    return mockProductTasks;
  }

  try {
    const parsed = JSON.parse(storedValue) as ProductTaskRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      persistProductTasks(mockProductTasks);
      return mockProductTasks;
    }
    return parsed;
  } catch {
    persistProductTasks(mockProductTasks);
    return mockProductTasks;
  }
}

export function addProductTask(task: ProductTaskRecord): ProductTaskRecord[] {
  const currentTasks = readProductTasks();
  const nextTasks = [task, ...currentTasks];
  persistProductTasks(nextTasks);
  return nextTasks;
}

export function deleteProductTask(taskId: string): ProductTaskRecord[] {
  const currentTasks = readProductTasks();
  const nextTasks = currentTasks.filter((task) => task.id !== taskId);
  persistProductTasks(nextTasks);
  return nextTasks;
}
