/**
 * Represents the available todo categories
 */
export type TodoCategory = 'work' | 'personal' | 'groceries' | 'household';

/**
 * Represents a todo item
 */
export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
    category: TodoCategory;
}

/**
 * TodoService class to handle todo business logic
 */
export class TodoService {
    private todos: Todo[] = [];
    private readonly STORAGE_KEY = 'typescript-todos';

    constructor() {
        this.loadFromStorage();
    }

    /**
     * Get all todos
     */
    public getAllTodos(): Todo[] {
        return [...this.todos];
    }

    /**
     * Get todos by category
     * @param category The category to filter by
     */
    public getTodosByCategory(category: TodoCategory): Todo[] {
        return this.todos.filter(todo => todo.category === category);
    }

    /**
     * Add a new todo
     * @param text The text of the todo
     * @param category The category of the todo
     */
    public addTodo(text: string, category: TodoCategory): Todo {
        const trimmedText = text.trim();
        if (!trimmedText) {
            throw new Error('Todo text cannot be empty');
        }

        const newTodo: Todo = {
            id: Date.now(),
            text: trimmedText,
            completed: false,
            createdAt: new Date(),
            category
        };

        this.todos.push(newTodo);
        this.saveToStorage();
        return newTodo;
    }

    /**
     * Toggle the completed status of a todo
     * @param id The id of the todo to toggle
     */
    public toggleTodo(id: number): Todo | undefined {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
        }
        return todo;
    }

    /**
     * Delete a todo
     * @param id The id of the todo to delete
     */
    public deleteTodo(id: number): boolean {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter(todo => todo.id !== id);
        const deleted = initialLength > this.todos.length;
        
        if (deleted) {
            this.saveToStorage();
        }
        
        return deleted;
    }

    /**
     * Save todos to localStorage
     */
    private saveToStorage(): void {
        try {
            const serializedTodos = JSON.stringify(this.todos);
            localStorage.setItem(this.STORAGE_KEY, serializedTodos);
        } catch (error) {
            console.error('Failed to save todos to localStorage:', error);
        }
    }

    /**
     * Load todos from localStorage
     */
    private loadFromStorage(): void {
        try {
            const serializedTodos = localStorage.getItem(this.STORAGE_KEY);
            if (serializedTodos) {
                // Parse the JSON string into an array of objects
                const parsedTodos = JSON.parse(serializedTodos);
                
                // Convert the plain objects to Todo objects with proper Date objects
                this.todos = parsedTodos.map((todo: any) => ({
                    ...todo,
                    createdAt: new Date(todo.createdAt),
                    // Handle existing todos that don't have a category
                    category: todo.category || 'personal'
                }));
            }
        } catch (error) {
            console.error('Failed to load todos from localStorage:', error);
            this.todos = [];
        }
    }
}

// Create and export a singleton instance of TodoService
export const todoService = new TodoService();
