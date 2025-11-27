import { Question } from "../types";

export const questions: Question[] = [
  // FREE QUESTIONS - HTML
  {
    id: "q1",
    title: "What is semantic HTML and why is it important?",
    level: "junior",
    language: "HTML",
    topic: "Frontend",
    timeMinutes: 10,
    isFree: true,
    difficulty: "Easy",
    company: "Google",
    description:
      "What is the main benefit of using semantic HTML elements like <article>, <nav>, and <header> instead of generic <div> elements?",
    options: [
      "Semantic elements make the page load faster",
      "Semantic elements improve accessibility and SEO by providing meaning to content structure",
      "Semantic elements automatically add CSS styling to the page",
      "Semantic elements are required for JavaScript to work properly",
    ],
    correctAnswerIndex: 1,
    sampleAnswer: `Semantic HTML uses HTML elements that clearly describe their meaning and purpose to both the browser and the developer. Examples include:

- <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>
- <h1> to <h6> for headings
- <figure> and <figcaption> for images with captions

Benefits:
1. Improved accessibility for screen readers
2. Better SEO
3. Easier to maintain and understand code
4. Better structure and meaning`,
    explanation:
      "Semantic HTML is crucial for accessibility and SEO. It helps search engines and assistive technologies understand the structure and meaning of your content. Screen readers can navigate better, and search engines can better understand what your content is about.",
    commonMistakes: [
      "Using <div> for everything instead of semantic elements",
      "Not considering accessibility implications",
      "Confusing semantic HTML with styling",
    ],
    techHint: "Think about the meaning of content, not just appearance",
  },

  // FREE QUESTIONS - CSS
  {
    id: "q2",
    title: "Explain the CSS Box Model",
    level: "mid",
    language: "CSS",
    topic: "Frontend",
    timeMinutes: 15,
    isFree: true,
    difficulty: "Medium",
    company: "Meta",
    description:
      'In the CSS box model, what does setting "box-sizing: border-box" do?',
    options: [
      "Makes the width/height include padding and border, making sizing calculations easier",
      "Removes all padding and borders from the element",
      "Only applies width/height to the content area, excluding padding and border",
      "Automatically centers the element within its container",
    ],
    correctAnswerIndex: 0,
    sampleAnswer: `The CSS box model consists of:

1. Content - The actual content (text, images)
2. Padding - Space between content and border
3. Border - The border around padding
4. Margin - Space outside the border

Total width = margin + border + padding + content + padding + border + margin

box-sizing property:
- content-box (default): width/height apply only to content
- border-box: width/height include padding and border

Best practice: Use border-box for easier sizing calculations.`,
    explanation:
      "Understanding the box model is fundamental to CSS layout. The box-sizing: border-box property makes width/height calculations include padding and border, so if you set width: 300px with 20px padding, the total width stays 300px instead of becoming 340px.",
    commonMistakes: [
      "Forgetting about padding and border in width calculations",
      "Not using box-sizing: border-box",
      "Confusing margin collapse behavior",
    ],
    techHint: "Use * { box-sizing: border-box; } as a reset",
  },

  // FREE QUESTIONS - JavaScript
  {
    id: "q3",
    title: "What is closure in JavaScript?",
    level: "senior",
    language: "JavaScript",
    topic: "Frontend",
    timeMinutes: 20,
    isFree: true,
    difficulty: "Hard",
    company: "Amazon",
    description:
      "What is a closure in JavaScript and what is its primary benefit?",
    options: [
      "A closure is a function that has access to variables in its outer scope, even after the outer function has returned. It enables data privacy and function factories.",
      "A closure is a way to close and terminate all running functions in JavaScript",
      "A closure is a CSS property used to close gaps between elements",
      "A closure is a method to close database connections after queries",
    ],
    correctAnswerIndex: 0,
    sampleAnswer: `A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

Example:
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount(); // 2

Use cases:
- Data privacy/encapsulation
- Function factories
- Event handlers
- Callbacks
- Module pattern`,
    explanation:
      "Closures are fundamental to JavaScript and enable powerful patterns like data privacy, partial application, and currying.",
    commonMistakes: [
      "Memory leaks from unintended closures",
      "Not understanding the scope chain",
      "Closure in loops without let/const",
    ],
    techHint: 'Think of closures as "functions with memory"',
  },

  // PREMIUM HTML QUESTIONS
  {
    id: "q4",
    title: "Explain the difference between <div> and <span>",
    level: "junior",
    language: "HTML",
    topic: "Frontend",
    timeMinutes: 8,
    isFree: false,
    difficulty: "Easy",
    company: "Shopify",
    description:
      "What is the main difference between <div> and <span> elements?",
    options: [
      "<div> is a block-level element that starts on a new line and takes full width; <span> is inline and only takes necessary width",
      "<div> is for text only; <span> is for images only",
      "<div> is faster to render than <span>",
      "<div> and <span> are exactly the same, just different names",
    ],
    correctAnswerIndex: 0,
    sampleAnswer: `<div> (Division):
- Block-level element
- Takes full width available
- Starts on a new line
- Used for larger structural grouping
- Can contain other block and inline elements

<span>:
- Inline element
- Only takes up necessary width
- Doesn't start on a new line
- Used for styling small portions of text
- Can only contain inline elements

Example:
<div class="container">
  <p>This is a <span class="highlight">highlighted</span> word.</p>
</div>`,
    explanation:
      "Understanding block vs inline elements is fundamental to HTML structure and CSS layout.",
    commonMistakes: [
      "Using span for layout containers",
      "Nesting block elements inside span",
      "Not understanding when to use each",
    ],
    techHint:
      "Block elements stack vertically, inline elements flow horizontally",
  },

  {
    id: "q5",
    title: "What are HTML data attributes and when should you use them?",
    level: "mid",
    language: "HTML",
    topic: "Frontend",
    timeMinutes: 12,
    isFree: false,
    difficulty: "Medium",
    company: "Stripe",
    description: "Explain data-* attributes and their use cases.",
    sampleAnswer: `Data attributes are custom attributes that start with "data-" and allow you to store extra information on HTML elements.

Syntax:
<div data-user-id="12345" data-role="admin">User Info</div>

Accessing in JavaScript:
const element = document.querySelector('div');
const userId = element.dataset.userId; // "12345"
const role = element.dataset.role; // "admin"

Use cases:
1. Store metadata for JavaScript
2. CSS styling hooks
3. Testing selectors
4. Configuration data
5. Track analytics

Best practices:
- Use for non-visible data only
- Keep attribute names lowercase with hyphens
- Don't use for sensitive data (it's visible in HTML)`,
    explanation:
      "Data attributes provide a standard way to store custom data on elements without polluting the global namespace or using non-standard attributes.",
    commonMistakes: [
      "Storing sensitive information",
      "Using them instead of proper form inputs",
      "Not camelCasing when accessing via dataset",
    ],
    techHint: "data-user-name becomes dataset.userName in JavaScript",
  },

  // PREMIUM CSS QUESTIONS
  {
    id: "q6",
    title: "Explain CSS Flexbox and its main properties",
    level: "junior",
    language: "CSS",
    topic: "Frontend",
    timeMinutes: 15,
    isFree: false,
    difficulty: "Easy",
    company: "Airbnb",
    description: "What is Flexbox and what are the most important properties?",
    sampleAnswer: `Flexbox is a one-dimensional layout method for arranging items in rows or columns.

Container properties:
- display: flex
- flex-direction: row | column
- justify-content: flex-start | center | space-between | space-around
- align-items: stretch | flex-start | center | flex-end
- flex-wrap: nowrap | wrap

Item properties:
- flex-grow: 0 (default) - ability to grow
- flex-shrink: 1 (default) - ability to shrink
- flex-basis: auto - initial size
- flex: shorthand (grow shrink basis)

Example:
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
    explanation:
      "Flexbox solves many layout problems that were difficult with floats and positioning. It's perfect for one-dimensional layouts.",
    commonMistakes: [
      "Forgetting display: flex on container",
      "Confusing justify-content with align-items",
      "Not understanding flex-shrink behavior",
    ],
    techHint: "justify-content = main axis, align-items = cross axis",
  },

  {
    id: "q7",
    title: "What is CSS Grid and how does it differ from Flexbox?",
    level: "mid",
    language: "CSS",
    topic: "Frontend",
    timeMinutes: 18,
    isFree: false,
    difficulty: "Medium",
    company: "Netflix",
    description: "Explain CSS Grid and when to use it over Flexbox.",
    sampleAnswer: `CSS Grid is a two-dimensional layout system for creating complex layouts.

Key properties:
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto;
  gap: 20px;
}

.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

Grid vs Flexbox:
- Grid: Two-dimensional (rows AND columns)
- Flexbox: One-dimensional (row OR column)

When to use Grid:
- Complex layouts
- Precise placement needed
- Overlapping elements
- Magazine-style layouts

When to use Flexbox:
- Navigation bars
- Card layouts
- Centering
- Simple one-direction layouts`,
    explanation:
      "Grid and Flexbox complement each other. Grid for overall page layout, Flexbox for component layouts.",
    commonMistakes: [
      "Using Grid when Flexbox would be simpler",
      "Not understanding fr units",
      "Overcomplicating simple layouts",
    ],
    techHint: "Grid = 2D layout, Flexbox = 1D layout",
  },

  {
    id: "q8",
    title: "Explain CSS specificity and the cascade",
    level: "senior",
    language: "CSS",
    topic: "Frontend",
    timeMinutes: 20,
    isFree: false,
    difficulty: "Hard",
    company: "Google",
    description: "How does CSS specificity work and what is the cascade?",
    sampleAnswer: `Specificity determines which CSS rule applies when multiple rules target the same element.

Specificity hierarchy (least to most specific):
1. Universal selector (*) - 0,0,0
2. Element/tag (div, p) - 0,0,1
3. Class (.class) - 0,1,0
4. ID (#id) - 1,0,0
5. Inline styles - 1,0,0,0
6. !important - overrides everything

Calculation example:
div.container #main p.text { } 
= 1,2,2 (1 ID, 2 classes, 2 elements)

The Cascade:
1. Importance (!important)
2. Specificity
3. Source order (last rule wins)

Best practices:
- Avoid !important
- Keep specificity low
- Use classes over IDs
- BEM methodology helps`,
    explanation:
      "Understanding specificity prevents CSS conflicts and helps write maintainable stylesheets.",
    commonMistakes: [
      "Overusing !important",
      "Using overly specific selectors",
      "Not understanding specificity calculation",
    ],
    techHint: "Keep specificity as low as possible for easier maintenance",
  },

  // PREMIUM JAVASCRIPT QUESTIONS
  {
    id: "q9",
    title: "What is the difference between var, let, and const?",
    level: "junior",
    language: "JavaScript",
    topic: "Frontend",
    timeMinutes: 12,
    isFree: false,
    difficulty: "Easy",
    company: "Microsoft",
    description:
      "Explain the differences between var, let, and const in JavaScript.",
    sampleAnswer: `var:
- Function-scoped
- Can be re-declared
- Hoisted (initialized as undefined)
- Creates global property

let:
- Block-scoped
- Cannot be re-declared in same scope
- Hoisted but not initialized (TDZ)
- Mutable

const:
- Block-scoped
- Cannot be re-declared or reassigned
- Hoisted but not initialized (TDZ)
- Must be initialized
- Objects/arrays contents can be modified

Example:
if (true) {
  var x = 1; // function scope
  let y = 2; // block scope
  const z = 3; // block scope
}
console.log(x); // 1
console.log(y); // ReferenceError

Best practice: Use const by default, let when reassignment needed, avoid var.`,
    explanation:
      "Modern JavaScript uses let and const to provide better scoping and prevent common bugs associated with var.",
    commonMistakes: [
      "Using var in modern code",
      "Thinking const makes objects immutable",
      "Not understanding Temporal Dead Zone",
    ],
    techHint: "Default to const, use let when you need to reassign",
  },

  {
    id: "q10",
    title: "Explain event bubbling and event capturing",
    level: "mid",
    language: "JavaScript",
    topic: "Frontend",
    timeMinutes: 15,
    isFree: false,
    difficulty: "Medium",
    company: "Uber",
    description: "What are event bubbling and capturing? How do they work?",
    sampleAnswer: `Event propagation has 3 phases:
1. Capturing phase (top to target)
2. Target phase
3. Bubbling phase (target to top)

Bubbling (default):
Event travels from target element up to root
<div onclick="console.log('div')">
  <button onclick="console.log('button')">Click</button>
</div>
// Output: "button" then "div"

Capturing:
Event travels from root down to target
element.addEventListener('click', handler, true); // true = capturing

Stopping propagation:
event.stopPropagation(); // stops bubbling/capturing
event.stopImmediatePropagation(); // stops all handlers

Event delegation:
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('List item clicked');
  }
});`,
    explanation:
      "Understanding event propagation is crucial for event delegation and preventing unwanted event handlers from firing.",
    commonMistakes: [
      "Not knowing bubbling is default",
      "Overusing stopPropagation",
      "Not leveraging event delegation",
    ],
    techHint: "Use event delegation for dynamic content",
  },

  {
    id: "q11",
    title: "What is the Event Loop in JavaScript?",
    level: "senior",
    language: "JavaScript",
    topic: "Frontend",
    timeMinutes: 25,
    isFree: false,
    difficulty: "Hard",
    company: "Meta",
    description: "Explain how the JavaScript event loop works.",
    sampleAnswer: `The event loop allows JavaScript to perform non-blocking operations despite being single-threaded.

Components:
1. Call Stack - Executes synchronous code
2. Web APIs - setTimeout, fetch, DOM events
3. Callback Queue - Callbacks from Web APIs
4. Microtask Queue - Promises, queueMicrotask
5. Event Loop - Moves tasks to call stack

Execution order:
1. Execute all synchronous code
2. Process all microtasks
3. Process one macrotask
4. Repeat

Example:
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

Output: 1, 4, 3, 2

Why?
- 1, 4 are synchronous
- 3 is microtask (runs before macrotasks)
- 2 is macrotask (setTimeout)`,
    explanation:
      "The event loop is fundamental to understanding asynchronous JavaScript and why certain code executes in a particular order.",
    commonMistakes: [
      "Thinking setTimeout(fn, 0) executes immediately",
      "Not understanding microtask priority",
      "Blocking the event loop with heavy computations",
    ],
    techHint: "Microtasks (Promises) run before macrotasks (setTimeout)",
  },

  {
    id: "q12",
    title: "Implement a debounce function from scratch",
    level: "senior",
    language: "JavaScript",
    topic: "Frontend",
    timeMinutes: 25,
    isFree: false,
    difficulty: "Hard",
    company: "Netflix",
    description: "Create a debounce utility function without using libraries.",
    sampleAnswer: `function debounce(func, delay) {
  let timeoutId;
  
  return function debounced(...args) {
    // Clear previous timeout
    clearTimeout(timeoutId);
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage:
const searchAPI = (query) => {
  console.log('Searching for:', query);
};

const debouncedSearch = debounce(searchAPI, 300);

input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Advanced: with immediate option
function debounce(func, delay, immediate = false) {
  let timeoutId;
  
  return function(...args) {
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func.apply(this, args);
    }, delay);
    
    if (callNow) func.apply(this, args);
  };
}`,
    explanation:
      "Debouncing limits the rate at which a function executes. Essential for search inputs, resize handlers, and scroll events to improve performance.",
    commonMistakes: [
      "Not clearing previous timeout",
      'Losing "this" context',
      "Not passing arguments correctly",
      "Confusing with throttle",
    ],
    techHint: "Debounce delays execution until after inactivity period",
  },

  // PREMIUM PYTHON QUESTIONS
  {
    id: "q13",
    title: "Explain Python list comprehensions",
    level: "junior",
    language: "Python",
    topic: "Backend",
    timeMinutes: 12,
    isFree: false,
    difficulty: "Easy",
    company: "Dropbox",
    description:
      "What is the correct syntax for a Python list comprehension that creates a list of squares from 0 to 9?",
    options: [
      "[x**2 for x in range(10)]",
      "[x*2 for x in range(10)]",
      "for x in range(10): x**2",
      "{x**2 for x in range(10)}",
    ],
    correctAnswerIndex: 0,
    sampleAnswer: `List comprehensions provide a concise way to create lists.

Basic syntax:
[expression for item in iterable if condition]

Examples:
# Square numbers
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Filter even numbers
evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Nested loops
pairs = [(x, y) for x in range(3) for y in range(3)]
# [(0,0), (0,1), (0,2), (1,0), ...]

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

When to use:
- Simple transformations
- Filtering
- When readability isn't sacrificed`,
    explanation:
      "List comprehensions are more concise and often faster than traditional for loops for creating lists.",
    commonMistakes: [
      "Making comprehensions too complex",
      "Not considering readability",
      "Forgetting about generator expressions for large data",
    ],
    techHint: "If it needs more than 2 lines, use a regular loop",
  },

  {
    id: "q14",
    title: "What are Python decorators?",
    level: "mid",
    language: "Python",
    topic: "Backend",
    timeMinutes: 20,
    isFree: false,
    difficulty: "Medium",
    company: "Instagram",
    description: "Explain decorators in Python with examples.",
    sampleAnswer: `Decorators modify or enhance functions without changing their code.

Basic decorator:
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function")
        result = func(*args, **kwargs)
        print("After function")
        return result
    return wrapper

@my_decorator
def say_hello(name):
    print(f"Hello, {name}!")

say_hello("Alice")
# Output:
# Before function
# Hello, Alice!
# After function

Common use cases:
1. Logging
2. Authentication
3. Timing/profiling
4. Caching
5. Input validation

Decorator with arguments:
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet():
    print("Hello!")`,
    explanation:
      "Decorators are a powerful feature for adding functionality to existing functions. They follow the Single Responsibility Principle.",
    commonMistakes: [
      "Not using functools.wraps",
      "Forgetting to return wrapper function",
      "Not handling *args and **kwargs",
      "Confusing decorator syntax",
    ],
    techHint: "@decorator is syntax sugar for func = decorator(func)",
  },

  {
    id: "q15",
    title: "Explain Python generators and yield",
    level: "senior",
    language: "Python",
    topic: "Backend",
    timeMinutes: 22,
    isFree: false,
    difficulty: "Hard",
    company: "Google",
    description: "What are generators and how does yield work?",
    sampleAnswer: `Generators are functions that return an iterator using yield instead of return.

Basic generator:
def count_up_to(n):
    count = 1
    while count <= n:
        yield count
        count += 1

counter = count_up_to(5)
print(next(counter))  # 1
print(next(counter))  # 2

Benefits:
1. Memory efficient - values generated on-demand
2. Can represent infinite sequences
3. Maintain state between calls

Generator expression:
squares = (x**2 for x in range(1000000))  # Uses minimal memory

Real-world example:
def read_large_file(file_path):
    with open(file_path) as file:
        for line in file:
            yield line.strip()

# Process huge file without loading into memory
for line in read_large_file('huge.txt'):
    process(line)

Generator pipeline:
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
first_ten = [next(fib) for _ in range(10)]`,
    explanation:
      "Generators are essential for working with large datasets efficiently. They compute values on-the-fly instead of storing everything in memory.",
    commonMistakes: [
      "Using return instead of yield",
      "Not understanding lazy evaluation",
      "Trying to reuse exhausted generators",
      "Using list() on infinite generators",
    ],
    techHint: "Generators are lazy - they only compute when requested",
  },

  // PREMIUM REACT QUESTIONS
  {
    id: "q16",
    title: "What are React Hooks and why were they introduced?",
    level: "junior",
    language: "React",
    topic: "Frontend",
    timeMinutes: 15,
    isFree: false,
    difficulty: "Easy",
    company: "Meta",
    description: "Explain React Hooks and their purpose.",
    sampleAnswer: `Hooks let you use state and other React features in function components.

Common hooks:
1. useState - Add state to components
2. useEffect - Side effects (data fetching, subscriptions)
3. useContext - Access context
4. useRef - Persist values, DOM refs
5. useMemo - Memoize expensive calculations
6. useCallback - Memoize functions

Example:
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}

Why Hooks?
- Reuse stateful logic without HOCs
- Organize related code together
- Use React features without classes
- Better code splitting`,
    explanation:
      "Hooks revolutionized React by making function components as powerful as class components while being more composable.",
    commonMistakes: [
      "Calling hooks conditionally",
      "Missing dependencies in useEffect",
      "Not understanding hook rules",
      "Using useState for everything",
    ],
    techHint: "Hooks must be called at top level, never conditionally",
  },

  {
    id: "q17",
    title: "Explain useEffect and its cleanup function",
    level: "mid",
    language: "React",
    topic: "Frontend",
    timeMinutes: 18,
    isFree: false,
    difficulty: "Medium",
    company: "Airbnb",
    description: "How does useEffect work? When and why do you need cleanup?",
    sampleAnswer: `useEffect runs side effects in function components.

Syntax:
useEffect(() => {
  // Effect code
  return () => {
    // Cleanup code
  };
}, [dependencies]);

Dependency patterns:
// Runs after every render
useEffect(() => { });

// Runs once (mount only)
useEffect(() => { }, []);

// Runs when count changes
useEffect(() => { }, [count]);

Cleanup example:
useEffect(() => {
  const subscription = api.subscribe(userId);
  const timer = setInterval(() => {}, 1000);
  window.addEventListener('resize', handleResize);
  
  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
    window.removeEventListener('resize', handleResize);
  };
}, [userId]);

When React calls cleanup:
1. Before re-running effect (deps changed)
2. When component unmounts`,
    explanation:
      "Cleanup functions prevent memory leaks and ensure your components don't have side effects after unmounting.",
    commonMistakes: [
      "Forgetting cleanup for subscriptions",
      "Not including all dependencies",
      "Using async functions directly in useEffect",
      "Cleanup not being a function",
    ],
    techHint: "Always cleanup what you setup in useEffect",
  },

  {
    id: "q18",
    title: "What is React Context and when should you use it?",
    level: "senior",
    language: "React",
    topic: "Frontend",
    timeMinutes: 20,
    isFree: false,
    difficulty: "Hard",
    company: "Netflix",
    description: "Explain React Context API and best practices.",
    sampleAnswer: `Context provides a way to pass data through the component tree without prop drilling.

Creating Context:
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const value = {
    theme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function Button() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}

When to use:
- Theme/locale
- Authentication
- User settings
- Not for frequent updates (causes re-renders)

Better alternatives for state:
- Redux/Zustand for complex state
- React Query for server state`,
    explanation:
      "Context is great for global data that changes infrequently. For frequent updates, consider state management libraries.",
    commonMistakes: [
      "Using Context for all state",
      "Not memoizing context value",
      "Causing unnecessary re-renders",
      "Not providing default value",
    ],
    techHint: "Wrap context value in useMemo to prevent unnecessary re-renders",
  },

  // PREMIUM NODE.JS QUESTIONS
  {
    id: "q19",
    title: "What is Node.js and how does it work?",
    level: "junior",
    language: "Node.js",
    topic: "Backend",
    timeMinutes: 15,
    isFree: false,
    difficulty: "Easy",
    company: "PayPal",
    description: "Explain Node.js and its core concepts.",
    sampleAnswer: `Node.js is a JavaScript runtime built on Chrome's V8 engine for building server-side applications.

Key features:
1. Non-blocking I/O
2. Event-driven architecture
3. Single-threaded with event loop
4. NPM - largest package ecosystem

Basic HTTP server:
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

Core modules:
- fs: File system operations
- http/https: Web servers
- path: File path utilities
- events: Event emitter
- stream: Streaming data

Why Node.js?
- JavaScript everywhere
- Fast (V8 engine)
- Great for I/O heavy apps
- Real-time applications
- Microservices`,
    explanation:
      "Node.js enables JavaScript on the server, making it possible to use one language for full-stack development.",
    commonMistakes: [
      "Using Node.js for CPU-intensive tasks",
      "Not handling errors properly",
      "Blocking the event loop",
      "Not understanding asynchronous nature",
    ],
    techHint: "Node.js excels at I/O operations, not CPU-heavy tasks",
  },

  {
    id: "q20",
    title: "Explain middleware in Express.js",
    level: "mid",
    language: "Node.js",
    topic: "Backend",
    timeMinutes: 18,
    isFree: false,
    difficulty: "Medium",
    company: "Uber",
    description: "What is middleware and how does it work in Express?",
    sampleAnswer: `Middleware functions have access to request, response, and next function in the request-response cycle.

Syntax:
function middleware(req, res, next) {
  // Do something
  next(); // Pass to next middleware
}

Types:
1. Application-level
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

2. Router-level
const router = express.Router();
router.use('/user', authMiddleware);

3. Error-handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

4. Built-in
app.use(express.json());
app.use(express.static('public'));

5. Third-party
const cors = require('cors');
app.use(cors());

Order matters:
app.use(logger); // Runs first
app.use(auth);   // Runs second
app.get('/api', handler); // Route handler

Custom middleware example:
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Unauthorized');
  // Verify token
  next();
};

app.use('/api', authenticate);`,
    explanation:
      "Middleware is the backbone of Express.js, enabling modular and reusable request processing logic.",
    commonMistakes: [
      "Forgetting to call next()",
      "Wrong middleware order",
      "Not handling errors in async middleware",
      "Sending response and calling next()",
    ],
    techHint: "Middleware executes in order - place error handlers last",
  },

  {
    id: "q21",
    title: "How does the Node.js Event Loop work?",
    level: "senior",
    language: "Node.js",
    topic: "Backend",
    timeMinutes: 25,
    isFree: false,
    difficulty: "Hard",
    company: "Stripe",
    description: "Explain the Node.js event loop in detail.",
    sampleAnswer: `The event loop enables Node.js to perform non-blocking I/O operations.

Phases (in order):
1. Timers - setTimeout, setInterval callbacks
2. Pending callbacks - I/O callbacks deferred
3. Idle, prepare - Internal use
4. Poll - Retrieve new I/O events, execute callbacks
5. Check - setImmediate callbacks
6. Close callbacks - socket.on('close')

Microtasks (between phases):
- process.nextTick() - Highest priority
- Promise callbacks

Example execution:
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

Output: nextTick, promise, timeout, immediate

Why it matters:
- Understanding async behavior
- Preventing event loop blocking
- Optimizing performance

Best practices:
- Use worker threads for CPU tasks
- Avoid blocking operations
- Use async/await properly
- Monitor event loop lag`,
    explanation:
      "The event loop is what makes Node.js non-blocking and enables high concurrency despite being single-threaded.",
    commonMistakes: [
      "Blocking event loop with sync operations",
      "Not understanding microtask priority",
      "Confusing setImmediate vs setTimeout",
      "Overusing process.nextTick",
    ],
    techHint: "process.nextTick runs before any I/O, use sparingly",
  },

  // PREMIUM SQL QUESTIONS
  {
    id: "q22",
    title: "Explain SQL JOIN types",
    level: "junior",
    language: "SQL",
    topic: "Database",
    timeMinutes: 15,
    isFree: false,
    difficulty: "Easy",
    company: "Oracle",
    description: "What are the different types of SQL JOINs?",
    sampleAnswer: `JOINs combine rows from multiple tables based on related columns.

INNER JOIN:
Returns only matching rows from both tables
SELECT * FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

LEFT JOIN (LEFT OUTER JOIN):
All rows from left table + matching from right
SELECT * FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

RIGHT JOIN (RIGHT OUTER JOIN):
All rows from right table + matching from left
SELECT * FROM orders o
RIGHT JOIN customers c ON o.customer_id = c.id;

FULL OUTER JOIN:
All rows from both tables
SELECT * FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id;

CROSS JOIN:
Cartesian product (all combinations)
SELECT * FROM products CROSS JOIN colors;

When to use:
- INNER: Only matching data
- LEFT: All from main table + matching
- RIGHT: Rarely used (use LEFT instead)
- FULL: All data from both
- CROSS: Combinations (use carefully)`,
    explanation:
      "Understanding JOINs is fundamental to working with relational databases and retrieving related data.",
    commonMistakes: [
      "Using INNER when you need LEFT",
      "Not understanding NULL in outer joins",
      "Accidental CROSS JOINs from missing ON",
      "Wrong join order affecting results",
    ],
    techHint: "LEFT JOIN keeps all left table rows, even without matches",
  },

  {
    id: "q23",
    title: "What are SQL indexes and when should you use them?",
    level: "mid",
    language: "SQL",
    topic: "Database",
    timeMinutes: 18,
    isFree: false,
    difficulty: "Medium",
    company: "Amazon",
    description: "Explain database indexes and their trade-offs.",
    sampleAnswer: `Indexes are data structures that improve query performance.

Creating indexes:
CREATE INDEX idx_email ON users(email);
CREATE UNIQUE INDEX idx_username ON users(username);
CREATE INDEX idx_name ON users(last_name, first_name);

Types:
1. B-Tree (default) - Most common
2. Hash - Equality comparisons only
3. Full-text - Text search
4. Spatial - Geographic data

When to use:
✓ Columns in WHERE clauses
✓ JOIN columns
✓ ORDER BY columns
✓ Foreign keys
✓ Columns with high cardinality

When NOT to use:
✗ Small tables
✗ Frequently updated columns
✗ Low cardinality columns (few distinct values)
✗ Columns rarely queried

Trade-offs:
Pros:
- Faster SELECT queries
- Faster sorting
- Enforces uniqueness

Cons:
- Slower INSERT/UPDATE/DELETE
- Takes up disk space
- Maintenance overhead

Example impact:
-- Without index: Full table scan
SELECT * FROM users WHERE email = 'user@example.com';

-- With index: Uses index
CREATE INDEX idx_email ON users(email);`,
    explanation:
      "Indexes are crucial for database performance but come with trade-offs. Understanding when and where to use them is key to optimization.",
    commonMistakes: [
      "Over-indexing tables",
      "Indexing low-cardinality columns",
      "Not considering composite indexes",
      "Forgetting to update statistics",
    ],
    techHint: "Index columns you query often, not columns you update often",
  },

  {
    id: "q24",
    title: "Explain database normalization",
    level: "senior",
    language: "SQL",
    topic: "Database",
    timeMinutes: 22,
    isFree: false,
    difficulty: "Hard",
    company: "Google",
    description:
      "What is database normalization and what are the normal forms?",
    sampleAnswer: `Normalization organizes data to reduce redundancy and improve integrity.

Normal Forms:

1NF (First Normal Form):
- Atomic values (no repeating groups)
- Each column has unique name
- Order doesn't matter

Bad:
| id | name | phones |
|----|------|--------|
| 1  | John | 111,222|

Good:
| id | name | phone |
|----|------|-------|
| 1  | John | 111   |
| 1  | John | 222   |

2NF (Second Normal Form):
- Must be in 1NF
- No partial dependencies
- All non-key attributes depend on entire primary key

3NF (Third Normal Form):
- Must be in 2NF
- No transitive dependencies
- Non-key columns don't depend on other non-key columns

Example:
Bad (violates 3NF):
users(id, name, city, state, zip_code, state_name)
// state_name depends on state (transitive)

Good:
users(id, name, city, state, zip_code)
states(state_code, state_name)

BCNF (Boyce-Codd Normal Form):
- Stricter version of 3NF
- Every determinant is a candidate key

When to denormalize:
- Read-heavy workloads
- Performance optimization
- Reporting/analytics
- Reduce complex joins`,
    explanation:
      "Normalization prevents data anomalies and redundancy. However, sometimes denormalization is needed for performance.",
    commonMistakes: [
      "Over-normalizing for read-heavy apps",
      "Not understanding trade-offs",
      "Forgetting about query performance",
      "Mixing normalized and denormalized data",
    ],
    techHint: "Normalize for data integrity, denormalize for performance",
  },

  // PREMIUM JAVA QUESTIONS
  {
    id: "q25",
    title: "Explain Java OOP principles",
    level: "junior",
    language: "Java",
    topic: "Backend",
    timeMinutes: 18,
    isFree: false,
    difficulty: "Easy",
    company: "Oracle",
    description: "What are the four main OOP principles in Java?",
    sampleAnswer: `Four pillars of OOP:

1. Encapsulation:
- Bundle data and methods together
- Hide internal details
- Use private fields, public methods

public class BankAccount {
    private double balance;
    
    public double getBalance() {
        return balance;
    }
    
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
}

2. Inheritance:
- IS-A relationship
- Code reuse
- extends keyword

public class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof");
    }
}

3. Polymorphism:
- Method overriding (runtime)
- Method overloading (compile-time)
- Interface implementation

Animal animal = new Dog();
animal.makeSound(); // Calls Dog's method

4. Abstraction:
- Hide complex implementation
- Abstract classes and interfaces

public abstract class Shape {
    abstract double calculateArea();
}

public interface Drawable {
    void draw();
}`,
    explanation:
      "These four principles are the foundation of object-oriented programming and essential for designing maintainable systems.",
    commonMistakes: [
      "Confusing inheritance with composition",
      "Breaking encapsulation with public fields",
      "Overusing inheritance",
      "Not understanding polymorphism",
    ],
    techHint: "Favor composition over inheritance when possible",
  },

  {
    id: "q26",
    title: "What are Java Streams and how do you use them?",
    level: "mid",
    language: "Java",
    topic: "Backend",
    timeMinutes: 20,
    isFree: false,
    difficulty: "Medium",
    company: "LinkedIn",
    description: "Explain Java Stream API and common operations.",
    sampleAnswer: `Streams provide a functional approach to processing collections.

Creating streams:
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> stream = numbers.stream();

Common operations:

Filter:
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());

Map:
List<Integer> squares = numbers.stream()
    .map(n -> n * n)
    .collect(Collectors.toList());

Reduce:
int sum = numbers.stream()
    .reduce(0, (a, b) -> a + b);

Sorting:
List<String> sorted = names.stream()
    .sorted()
    .collect(Collectors.toList());

Finding:
Optional<Integer> first = numbers.stream()
    .filter(n -> n > 3)
    .findFirst();

Complex example:
List<String> result = people.stream()
    .filter(p -> p.getAge() > 18)
    .map(Person::getName)
    .sorted()
    .limit(10)
    .collect(Collectors.toList());

Parallel streams:
long count = bigList.parallelStream()
    .filter(predicate)
    .count();`,
    explanation:
      "Streams enable declarative, functional-style operations on collections. They're lazy and can be parallelized for better performance.",
    commonMistakes: [
      "Reusing streams (they're one-time use)",
      "Not understanding lazy evaluation",
      "Overusing parallel streams",
      "Side effects in stream operations",
    ],
    techHint:
      "Streams are lazy - operations only execute when terminal operation is called",
  },

  {
    id: "q27",
    title: "Explain Java memory management and garbage collection",
    level: "senior",
    language: "Java",
    topic: "Backend",
    timeMinutes: 25,
    isFree: false,
    difficulty: "Hard",
    company: "Google",
    description: "How does Java manage memory and what is garbage collection?",
    sampleAnswer: `Java memory is divided into several areas:

Memory Areas:
1. Heap - Objects and arrays
2. Stack - Method calls, local variables
3. Method Area - Class structures, constants
4. PC Register - Current instruction
5. Native Method Stack - Native method calls

Garbage Collection:
Automatically reclaims memory from unreachable objects.

GC Process:
1. Mark - Identify reachable objects
2. Sweep - Remove unreachable objects
3. Compact - Defragment memory (optional)

Generational GC:
- Young Generation (Eden, S0, S1)
  - Minor GC - fast, frequent
- Old Generation (Tenured)
  - Major GC - slower, less frequent
- Permanent Generation/Metaspace
  - Class metadata

Types of GC:
1. Serial GC - Single thread
2. Parallel GC - Multiple threads
3. CMS - Concurrent Mark Sweep
4. G1 GC - Garbage First (default Java 9+)
5. ZGC - Low latency

Making objects eligible for GC:
obj = null; // Remove reference
obj1 = obj2; // Reassign
// Exit method (local variables)

Best practices:
- Avoid memory leaks
- Close resources (try-with-resources)
- Don't hold unnecessary references
- Use weak references when appropriate
- Profile memory usage`,
    explanation:
      "Understanding memory management is crucial for writing efficient Java applications and preventing memory leaks.",
    commonMistakes: [
      "Assuming immediate garbage collection",
      "Calling System.gc() unnecessarily",
      "Not closing resources",
      "Creating unnecessary objects in loops",
    ],
    techHint: "Objects are GC eligible when no references exist to them",
  },

  // PREMIUM RUBY QUESTIONS
  {
    id: "q28",
    title: "What are Ruby blocks, procs, and lambdas?",
    level: "junior",
    language: "Ruby",
    topic: "Backend",
    timeMinutes: 15,
    isFree: false,
    difficulty: "Easy",
    company: "Shopify",
    description:
      "Explain the differences between blocks, procs, and lambdas in Ruby.",
    sampleAnswer: `Blocks, Procs, and Lambdas are ways to pass code around in Ruby.

Blocks:
- Not objects
- Passed to methods with do...end or {}
- Cannot be saved to variables

[1, 2, 3].each do |num|
  puts num
end

[1, 2, 3].each { |num| puts num }

Procs:
- Objects (can be stored in variables)
- Created with Proc.new
- Don't check argument count
- Return exits the method

my_proc = Proc.new { |x| puts x }
my_proc.call(5)  # 5

Lambdas:
- Special type of Proc
- Created with lambda or ->
- Check argument count strictly
- Return exits only the lambda

my_lambda = lambda { |x| puts x }
my_lambda = ->(x) { puts x }
my_lambda.call(5)  # 5

Key differences:
- Lambdas check args, Procs don't
- Return in lambda exits lambda only
- Return in Proc exits entire method

Use blocks for single-use code
Use Procs/Lambdas for reusable code`,
    explanation:
      "Understanding blocks, procs, and lambdas is essential for writing idiomatic Ruby code and working with higher-order functions.",
    commonMistakes: [
      "Confusing Proc and Lambda behavior",
      "Not understanding return differences",
      "Forgetting argument count checking",
      "Using wrong syntax for each",
    ],
    techHint: "Lambdas are stricter, Procs are more flexible",
  },

  {
    id: "q29",
    title: "Explain Ruby modules and mixins",
    level: "mid",
    language: "Ruby",
    topic: "Backend",
    timeMinutes: 18,
    isFree: false,
    difficulty: "Medium",
    company: "GitHub",
    description: "What are modules in Ruby and how do mixins work?",
    sampleAnswer: `Modules are containers for methods, classes, and constants. They provide namespacing and mixins.

Namespacing:
module MyApp
  class User
    # ...
  end
end

user = MyApp::User.new

Mixins (include/extend):
module Greetable
  def greet
    "Hello!"
  end
end

class Person
  include Greetable  # adds as instance methods
end

person = Person.new
person.greet  # "Hello!"

class Company
  extend Greetable  # adds as class methods
end

Company.greet  # "Hello!"

Common modules:
module Comparable
  # Provides <, <=, ==, >, >=, between?
end

module Enumerable
  # Provides map, select, reduce, etc.
end

Real example:
module Timestampable
  def created_at
    @created_at ||= Time.now
  end
end

class Post
  include Timestampable
end

Multiple mixins:
class Article
  include Comparable
  include Enumerable
  include Timestampable
end

Method lookup order:
1. Class itself
2. Included modules (reverse order)
3. Superclass
4. Superclass modules`,
    explanation:
      "Modules enable code reuse without inheritance. Ruby uses single inheritance but multiple mixins.",
    commonMistakes: [
      "Confusing include vs extend",
      "Not understanding method lookup order",
      "Overusing modules instead of composition",
      "Circular module dependencies",
    ],
    techHint: "include = instance methods, extend = class methods",
  },

  {
    id: "q30",
    title: "What is metaprogramming in Ruby?",
    level: "senior",
    language: "Ruby",
    topic: "Backend",
    timeMinutes: 25,
    isFree: false,
    difficulty: "Hard",
    company: "Basecamp",
    description: "Explain metaprogramming in Ruby with practical examples.",
    sampleAnswer: `Metaprogramming is writing code that writes code at runtime.

define_method:
class Person
  [:name, :age, :email].each do |attr|
    define_method(attr) do
      instance_variable_get("@#{attr}")
    end
    
    define_method("#{attr}=") do |value|
      instance_variable_set("@#{attr}", value)
    end
  end
end

method_missing:
class DynamicFinder
  def method_missing(method, *args)
    if method.to_s =~ /^find_by_(.+)$/
      attribute = $1
      find(attribute, args.first)
    else
      super
    end
  end
  
  def respond_to_missing?(method, include_private = false)
    method.to_s.start_with?('find_by_') || super
  end
end

user = DynamicFinder.new
user.find_by_email('test@example.com')

class_eval / instance_eval:
class User
end

User.class_eval do
  def admin?
    @role == 'admin'
  end
end

send:
obj = "hello"
obj.send(:upcase)  # "HELLO"

Real-world example (ActiveRecord-like):
class Model
  def self.attr_accessor_with_validation(*attrs)
    attrs.each do |attr|
      define_method(attr) do
        instance_variable_get("@#{attr}")
      end
      
      define_method("#{attr}=") do |value|
        raise "Invalid value" if value.nil?
        instance_variable_set("@#{attr}", value)
      end
    end
  end
end

Dangers:
- Hard to debug
- Performance overhead
- Breaking tools (IDE, linters)
- Unclear code flow`,
    explanation:
      "Metaprogramming is powerful but should be used sparingly. It's the foundation of Rails and many Ruby gems.",
    commonMistakes: [
      "Overusing metaprogramming",
      "Not implementing respond_to_missing?",
      "Creating unmaintainable code",
      "Ignoring performance implications",
    ],
    techHint: "Use metaprogramming to reduce duplication, not to be clever",
  },

  // PREMIUM TYPESCRIPT QUESTIONS
  {
    id: "q31",
    title: "What are TypeScript interfaces and types?",
    level: "junior",
    language: "TypeScript",
    topic: "Frontend",
    timeMinutes: 15,
    isFree: false,
    difficulty: "Easy",
    company: "Microsoft",
    description:
      "Explain the difference between interfaces and type aliases in TypeScript.",
    sampleAnswer: `Interfaces and type aliases both define object shapes, but have key differences.

Interface:
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;  // optional
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};

Type Alias:
type User = {
  id: number;
  name: string;
  email: string;
  age?: number;
};

Key Differences:

1. Extension:
// Interface - uses extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Type - uses intersection
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

2. Declaration Merging:
// Interfaces can be merged
interface User {
  name: string;
}

interface User {
  age: number;
}

// Result: User has both name and age

3. Types can represent primitives:
type ID = string | number;
type Status = 'active' | 'inactive';

When to use:
- Interface: Object shapes, classes, public APIs
- Type: Unions, intersections, computed properties`,
    explanation:
      "Both interfaces and types have their use cases. Interfaces are better for object-oriented patterns, types for functional patterns.",
    commonMistakes: [
      "Using types when interfaces are clearer",
      "Not leveraging declaration merging",
      "Confusing extends vs intersection",
      "Over-complicating type definitions",
    ],
    techHint: "Prefer interfaces for objects, types for everything else",
  },

  {
    id: "q32",
    title: "Explain TypeScript generics",
    level: "mid",
    language: "TypeScript",
    topic: "Frontend",
    timeMinutes: 20,
    isFree: false,
    difficulty: "Medium",
    company: "Airbnb",
    description: "What are generics and how do you use them in TypeScript?",
    sampleAnswer: `Generics allow creating reusable, type-safe components.

Basic Generic Function:
function identity<T>(arg: T): T {
  return arg;
}

identity<string>("hello");  // "hello"
identity<number>(42);       // 42

Generic Array Function:
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]);      // number
const str = firstElement(['a', 'b', 'c']); // string

Generic Interface:
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success"
};

Generic Class:
class DataStore<T> {
  private data: T[] = [];
  
  add(item: T): void {
    this.data.push(item);
  }
  
  get(index: number): T {
    return this.data[index];
  }
}

const numberStore = new DataStore<number>();
numberStore.add(1);

Generic Constraints:
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello");     // OK
logLength([1, 2, 3]);   // OK
logLength({ length: 10 }); // OK

Multiple Type Parameters:
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}`,
    explanation:
      "Generics enable type-safe reusable code. They're essential for libraries and utility functions.",
    commonMistakes: [
      "Not using constraints when needed",
      "Over-constraining generics",
      "Using any instead of generics",
      "Forgetting default type parameters",
    ],
    techHint: "Generics = type parameters for functions/classes",
  },

  {
    id: "q33",
    title: "Advanced TypeScript: Utility types and mapped types",
    level: "senior",
    language: "TypeScript",
    topic: "Frontend",
    timeMinutes: 25,
    isFree: false,
    difficulty: "Hard",
    company: "Stripe",
    description:
      "Explain TypeScript utility types and how to create custom mapped types.",
    sampleAnswer: `TypeScript provides built-in utility types and allows creating custom ones.

Built-in Utility Types:

Partial<T>:
interface User {
  name: string;
  age: number;
  email: string;
}

type PartialUser = Partial<User>;
// All properties optional

Required<T>:
type RequiredUser = Required<PartialUser>;
// All properties required

Readonly<T>:
type ReadonlyUser = Readonly<User>;
// All properties readonly

Pick<T, K>:
type UserPreview = Pick<User, 'name' | 'email'>;
// { name: string; email: string; }

Omit<T, K>:
type UserWithoutAge = Omit<User, 'age'>;
// { name: string; email: string; }

Record<K, T>:
type UserRoles = Record<string, User>;
// { [key: string]: User; }

Custom Mapped Types:

Make properties optional:
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UserWithOptionalAge = Optional<User, 'age'>;

Deep Readonly:
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

Conditional Types:
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

Advanced Example:
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "John" };
}

type UserReturn = GetReturnType<typeof getUser>;
// { id: number; name: string; }

Template Literal Types:
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = \`on\${Capitalize<EventName>}\`;
// "onClick" | "onFocus" | "onBlur"`,
    explanation:
      "Utility and mapped types enable powerful type transformations. They're essential for building type-safe libraries.",
    commonMistakes: [
      "Not understanding keyof and typeof",
      "Misusing conditional types",
      "Creating overly complex types",
      "Not leveraging built-in utilities",
    ],
    techHint: "Master built-in utilities before creating custom ones",
  },
];
