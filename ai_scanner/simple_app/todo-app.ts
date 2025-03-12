import { Todo, TodoCategory, todoService } from './todo-types.js';

/**
 * TodoApp class to handle UI interactions
 */
class TodoApp {
    private todoInput: HTMLInputElement;
    private categorySelect: HTMLSelectElement;
    private addButton: HTMLButtonElement;
    private todoList: HTMLUListElement;
    private categoryTabs: HTMLDivElement;
    private activeCategory: TodoCategory | 'all' = 'all';

    constructor() {
        // Get DOM elements
        this.todoInput = document.getElementById('new-todo') as HTMLInputElement;
        this.categorySelect = document.getElementById('todo-category') as HTMLSelectElement;
        this.addButton = document.getElementById('add-todo') as HTMLButtonElement;
        this.todoList = document.getElementById('todo-list') as HTMLUListElement;
        this.categoryTabs = document.getElementById('category-tabs') as HTMLDivElement;

        // Initialize the app
        this.initialize();
    }

    /**
     * Initialize the app
     */
    private initialize(): void {
        // Set up event listeners
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Set up category tabs
        this.setupCategoryTabs();

        // Render initial todos
        this.renderTodos();
    }

    /**
     * Set up category tabs for filtering
     */
    private setupCategoryTabs(): void {
        // Create "All" tab
        this.createCategoryTab('all', 'All');
        
        // Create tabs for each category
        const categories: TodoCategory[] = ['work', 'personal', 'groceries', 'household'];
        categories.forEach(category => {
            this.createCategoryTab(category, this.formatCategoryName(category));
        });
    }

    /**
     * Create a category tab
     */
    private createCategoryTab(category: TodoCategory | 'all', displayName: string): void {
        const tab = document.createElement('button');
        tab.className = `category-tab ${category === this.activeCategory ? 'active' : ''}`;
        tab.textContent = displayName;
        tab.addEventListener('click', () => {
            // Update active category
            this.activeCategory = category;
            
            // Update active tab
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            tab.classList.add('active');
            
            // Render filtered todos
            this.renderTodos();
        });
        
        this.categoryTabs.appendChild(tab);
    }

    /**
     * Format category name for display
     */
    private formatCategoryName(category: TodoCategory): string {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Add a new todo
     */
    private addTodo(): void {
        const text = this.todoInput.value;
        const category = this.categorySelect.value as TodoCategory;
        
        try {
            todoService.addTodo(text, category);
            this.todoInput.value = '';
            this.renderTodos();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred');
        }
    }

    /**
     * Toggle a todo's completed status
     * @param id The id of the todo to toggle
     */
    private toggleTodo(id: number): void {
        todoService.toggleTodo(id);
        this.renderTodos();
    }

    /**
     * Delete a todo
     * @param id The id of the todo to delete
     */
    private deleteTodo(id: number): void {
        todoService.deleteTodo(id);
        this.renderTodos();
    }

    /**
     * Render the todo list
     */
    private renderTodos(): void {
        // Get todos based on active category
        let todos: Todo[];
        if (this.activeCategory === 'all') {
            todos = todoService.getAllTodos();
        } else {
            todos = todoService.getTodosByCategory(this.activeCategory);
        }
        
        // Clear the current list
        this.todoList.innerHTML = '';
        
        // Add each todo to the list
        todos.forEach(todo => {
            const todoItem = this.createTodoElement(todo);
            this.todoList.appendChild(todoItem);
        });
    }

    /**
     * Create a todo list item element
     * @param todo The todo to create an element for
     */
    private createTodoElement(todo: Todo): HTMLLIElement {
        // Create the list item
        const listItem = document.createElement('li');
        listItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        listItem.dataset.id = todo.id.toString();
        listItem.dataset.category = todo.category;
        
        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
        
        // Create the category badge
        const categoryBadge = document.createElement('span');
        categoryBadge.className = `category-badge ${todo.category}`;
        categoryBadge.textContent = this.formatCategoryName(todo.category);
        
        // Create the text element
        const textElement = document.createElement('span');
        textElement.className = 'todo-text';
        textElement.textContent = todo.text;
        
        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-todo';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => this.deleteTodo(todo.id));
        
        // Add elements to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(categoryBadge);
        listItem.appendChild(textElement);
        listItem.appendChild(deleteButton);
        
        return listItem;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
