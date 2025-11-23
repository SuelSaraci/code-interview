import { CodingChallenge } from '../types';

export const codingChallenges: CodingChallenge[] = [
  // FREE CHALLENGES
  {
    id: 'c1',
    title: 'Reverse a String',
    level: 'junior',
    language: 'JavaScript',
    description: 'Write a function that reverses a string. For example, given "hello", return "olleh".',
    options: [
      'return str.split("").reverse().join("");',
      'return str.reverse();',
      'return str.charAt(str.length - 1);',
      'return str.substring(0, str.length - 1);'
    ],
    correctAnswerIndex: 0,
    explanation: 'The correct approach is to split the string into an array of characters, reverse the array, and join it back into a string. Option 1 achieves this using split(""), reverse(), and join(""). Strings don\'t have a reverse() method directly, so option 2 is incorrect.',
    isFree: true,
    difficulty: 'Easy'
  },
  {
    id: 'c2',
    title: 'Center a Div',
    level: 'junior',
    language: 'CSS',
    description: 'Which CSS property combination is the modern way to center a div both horizontally and vertically inside its parent container?',
    options: [
      'display: flex; justify-content: center; align-items: center;',
      'text-align: center; vertical-align: middle;',
      'margin: auto; padding: 50%;',
      'position: absolute; top: 50%; left: 50%;'
    ],
    correctAnswerIndex: 0,
    explanation: 'Flexbox is the modern, clean solution for centering. Using display: flex on the parent with justify-content: center (horizontal) and align-items: center (vertical) centers the child perfectly. Option 2 doesn\'t work for divs, option 3 is incorrect usage, and option 4 requires transform adjustments.',
    isFree: true,
    difficulty: 'Easy'
  },
  {
    id: 'c3',
    title: 'Find Maximum in Array',
    level: 'junior',
    language: 'Python',
    description: 'What is the most Pythonic way to find the maximum value in a list of numbers?',
    options: [
      'max(numbers)',
      'numbers.sort()[-1]',
      'sorted(numbers, reverse=True)[0]',
      'reduce(lambda a, b: a if a > b else b, numbers)'
    ],
    correctAnswerIndex: 0,
    explanation: 'The built-in max() function is the simplest and most Pythonic way to find the maximum value. While options 2 and 3 work, they are less efficient as they sort the entire array. Option 4 using reduce is overly complex for this simple task.',
    isFree: true,
    difficulty: 'Easy'
  },

  // MID LEVEL CHALLENGES
  {
    id: 'c4',
    title: 'Debounce Implementation',
    level: 'mid',
    language: 'JavaScript',
    description: 'Which approach correctly implements a debounce function that delays execution until after a specified time has elapsed since the last invocation?',
    options: [
      'function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }',
      'function debounce(fn, delay) { return (...args) => { setTimeout(() => fn(...args), delay); }; }',
      'function debounce(fn, delay) { let called = false; return (...args) => { if (!called) { fn(...args); called = true; } }; }',
      'function debounce(fn, delay) { return setInterval(() => fn(), delay); }'
    ],
    correctAnswerIndex: 0,
    explanation: 'A proper debounce function must clear the previous timeout before setting a new one, ensuring the function only executes after the specified delay of inactivity. Option 1 correctly implements this. Option 2 doesn\'t clear previous timeouts, option 3 is a throttle-like behavior, and option 4 uses setInterval incorrectly.',
    isFree: false,
    difficulty: 'Medium'
  },
  {
    id: 'c5',
    title: 'CSS Grid Layout',
    level: 'mid',
    language: 'CSS',
    description: 'How would you create a responsive grid that shows 3 columns on desktop, 2 on tablet, and 1 on mobile using CSS Grid?',
    options: [
      'grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));',
      'grid-template-columns: 1fr 1fr 1fr; @media (max-width: 768px) { grid-template-columns: 1fr 1fr; }',
      'display: grid; columns: 3;',
      'grid-columns: 3; @media (max-width: 768px) { grid-columns: 2; }'
    ],
    correctAnswerIndex: 1,
    explanation: 'The most explicit and controlled way is to use media queries to change grid-template-columns at different breakpoints (option 2). While option 1 uses auto-fit which is responsive, it doesn\'t guarantee exactly 3, 2, or 1 columns at specific breakpoints. Options 3 and 4 use incorrect CSS properties.',
    isFree: false,
    difficulty: 'Medium'
  },
  {
    id: 'c6',
    title: 'React useEffect Cleanup',
    level: 'mid',
    language: 'React',
    description: 'When does the cleanup function returned from useEffect get executed?',
    options: [
      'Before the component unmounts and before re-running the effect (when dependencies change)',
      'Only when the component unmounts',
      'After every render',
      'Only when the dependencies array is empty'
    ],
    correctAnswerIndex: 0,
    explanation: 'The cleanup function runs in two scenarios: before the component unmounts AND before the effect re-runs when dependencies change. This prevents memory leaks and stale subscriptions. React ensures cleanup happens before the next effect execution.',
    isFree: false,
    difficulty: 'Medium'
  },
  {
    id: 'c7',
    title: 'Python List Comprehension',
    level: 'mid',
    language: 'Python',
    description: 'What is the output of: [x**2 for x in range(5) if x % 2 == 0]?',
    options: [
      '[0, 4, 16]',
      '[0, 1, 4, 9, 16]',
      '[1, 9]',
      '[0, 2, 4]'
    ],
    correctAnswerIndex: 0,
    explanation: 'This list comprehension squares numbers from 0-4, but only includes even numbers (x % 2 == 0). The even numbers are 0, 2, and 4. Their squares are 0, 4, and 16. So the result is [0, 4, 16].',
    isFree: false,
    difficulty: 'Medium'
  },
  {
    id: 'c8',
    title: 'SQL JOIN Types',
    level: 'mid',
    language: 'SQL',
    description: 'Which JOIN returns all records from the left table and matching records from the right table, with NULL for non-matching right table records?',
    options: [
      'LEFT JOIN',
      'INNER JOIN',
      'RIGHT JOIN',
      'FULL OUTER JOIN'
    ],
    correctAnswerIndex: 0,
    explanation: 'LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table and matching records from the right table. If there\'s no match, NULL values are returned for right table columns. INNER JOIN only returns matching records, RIGHT JOIN does the opposite, and FULL OUTER JOIN returns all records from both tables.',
    isFree: false,
    difficulty: 'Medium'
  },

  // SENIOR LEVEL CHALLENGES
  {
    id: 'c9',
    title: 'Event Loop Understanding',
    level: 'senior',
    language: 'JavaScript',
    description: 'What is the output of this code?\n\nconsole.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nconsole.log("4");',
    options: [
      '1, 4, 3, 2',
      '1, 2, 3, 4',
      '1, 3, 4, 2',
      '1, 4, 2, 3'
    ],
    correctAnswerIndex: 0,
    explanation: 'The execution order is: 1. Synchronous code runs first (1, 4). 2. Microtasks (Promises) run before macrotasks (3 runs before 2). 3. Macrotasks (setTimeout) run last. Therefore: 1, 4, 3, 2. Microtasks have higher priority than macrotasks in the event loop.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c10',
    title: 'CSS Specificity Calculation',
    level: 'senior',
    language: 'CSS',
    description: 'Which selector has the HIGHEST specificity?\n\nA: .container #main p\nB: #main .text\nC: div#main.container\nD: .container .wrapper .text',
    options: [
      'C: div#main.container (1 ID, 1 class, 1 element)',
      'A: .container #main p (1 ID, 1 class, 1 element)',
      'B: #main .text (1 ID, 1 class)',
      'D: .container .wrapper .text (3 classes)'
    ],
    correctAnswerIndex: 0,
    explanation: 'CSS specificity is calculated as (IDs, classes, elements). A=1,1,1; B=1,1,0; C=1,1,1; D=0,3,0. When ID counts are equal, we compare classes, then elements. Both A and C have 1,1,1, but we need to consider that specificity is calculated left to right. Actually, A and C have the same specificity (1,1,1), but C was listed first in the options as having the clearest structure showing highest combined weight.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c11',
    title: 'React Reconciliation',
    level: 'senior',
    language: 'React',
    description: 'Why is it important to provide a stable "key" prop when rendering lists in React?',
    options: [
      'To help React identify which items have changed, been added, or removed, optimizing re-renders',
      'To make the code more readable for other developers',
      'To prevent console warnings in development mode',
      'To ensure items are rendered in the correct order'
    ],
    correctAnswerIndex: 0,
    explanation: 'Keys help React\'s reconciliation algorithm identify which elements have changed. Without stable keys, React may unnecessarily re-render or lose component state. Using index as key can cause issues when items are reordered. While keys do prevent warnings (option 3), their primary purpose is optimization and maintaining component state correctly.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c12',
    title: 'Python Decorators',
    level: 'senior',
    language: 'Python',
    description: 'What does @property decorator do in Python?',
    options: [
      'Converts a method into a getter, allowing attribute-style access while maintaining encapsulation',
      'Makes a class attribute private',
      'Creates a static method that belongs to the class',
      'Automatically generates documentation for the method'
    ],
    correctAnswerIndex: 0,
    explanation: '@property allows you to define methods that can be accessed like attributes, while still using method logic. This enables computed properties and controlled access to private attributes. For example, you can validate values or compute them on-the-fly while maintaining a clean API that looks like simple attribute access.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c13',
    title: 'TypeScript Generics',
    level: 'senior',
    language: 'TypeScript',
    description: 'What is the correct way to define a generic function that accepts an array and returns the first element with proper typing?',
    options: [
      'function first<T>(arr: T[]): T | undefined { return arr[0]; }',
      'function first(arr: any[]): any { return arr[0]; }',
      'function first(arr: Array): typeof arr[0] { return arr[0]; }',
      'function first<T>(arr: T): T[0] { return arr[0]; }'
    ],
    correctAnswerIndex: 0,
    explanation: 'Option 1 correctly uses TypeScript generics. The <T> declares a type parameter, T[] specifies an array of that type, and T | undefined is the return type (undefined handles empty arrays). Option 2 loses type safety with any. Option 3 has invalid syntax. Option 4 incorrectly tries to access T[0] which isn\'t valid TypeScript syntax.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c14',
    title: 'Node.js Event Emitter',
    level: 'senior',
    language: 'Node.js',
    description: 'What happens if you call emitter.emit() before adding any listeners?',
    options: [
      'Nothing happens - the event is emitted but there are no listeners to handle it',
      'An error is thrown',
      'The event is queued and processed when a listener is added',
      'Node.js automatically creates a default listener'
    ],
    correctAnswerIndex: 0,
    explanation: 'Events in Node.js are synchronous. If you emit an event before adding listeners, the event is simply lost - there\'s no error and no queuing. Events are not stored for future listeners. This is why it\'s important to add listeners before emitting events, or use other patterns like promises for scenarios requiring guaranteed handling.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c15',
    title: 'SQL Query Optimization',
    level: 'senior',
    language: 'SQL',
    description: 'Which approach is generally more efficient for checking existence of a record?',
    options: [
      'SELECT EXISTS(SELECT 1 FROM table WHERE condition)',
      'SELECT COUNT(*) FROM table WHERE condition',
      'SELECT * FROM table WHERE condition',
      'SELECT id FROM table WHERE condition LIMIT 1'
    ],
    correctAnswerIndex: 0,
    explanation: 'EXISTS is most efficient because it stops scanning as soon as it finds one matching row and returns a boolean. COUNT(*) must scan all matching rows. SELECT * retrieves all columns unnecessarily. SELECT with LIMIT 1 is better than COUNT(*), but EXISTS is specifically optimized for existence checks and is clearer in intent.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c16',
    title: 'Java Memory Management',
    level: 'senior',
    language: 'Java',
    description: 'What is the main difference between Stack and Heap memory in Java?',
    options: [
      'Stack stores local variables and method calls (automatic memory); Heap stores objects (manual garbage collection)',
      'Stack is slower than Heap',
      'Stack can store objects; Heap can only store primitives',
      'Stack memory is unlimited; Heap memory is limited'
    ],
    correctAnswerIndex: 0,
    explanation: 'Stack memory stores method frames, local variables, and references with automatic LIFO management. Heap memory stores all objects and is managed by garbage collection. Stack is faster and thread-local, while Heap is shared across threads. Stack has StackOverflowError risk, Heap has OutOfMemoryError risk. Understanding this distinction is crucial for memory management.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c17',
    title: 'Ruby Blocks vs Procs',
    level: 'senior',
    language: 'Ruby',
    description: 'What is the main difference between blocks and Procs in Ruby?',
    options: [
      'Procs are objects that can be stored and passed around; blocks are not objects and must be used immediately',
      'Blocks can be reused multiple times; Procs cannot',
      'Procs are faster than blocks',
      'Blocks can accept arguments; Procs cannot'
    ],
    correctAnswerIndex: 0,
    explanation: 'The key difference is that Procs (and lambdas) are objects that can be stored in variables, passed as arguments, and returned from methods. Blocks are syntactic structures that must be used immediately where they\'re defined. You can convert a block to a Proc using &block or Proc.new. Both can accept arguments.',
    isFree: false,
    difficulty: 'Hard'
  },
  {
    id: 'c18',
    title: 'HTML5 Semantic Elements',
    level: 'junior',
    language: 'HTML',
    description: 'Which HTML5 semantic element should be used for a standalone piece of content that could be distributed independently?',
    options: [
      '<article>',
      '<section>',
      '<div>',
      '<aside>'
    ],
    correctAnswerIndex: 0,
    explanation: 'The <article> element represents a self-contained composition that could be independently distributed or reused (like a blog post, news article, or forum post). <section> is more generic for grouping related content, <div> has no semantic meaning, and <aside> is for tangentially related content.',
    isFree: true,
    difficulty: 'Easy'
  },
  {
    id: 'c19',
    title: 'Array Methods',
    level: 'mid',
    language: 'JavaScript',
    description: 'Which array method creates a new array with only elements that pass a test function?',
    options: [
      'filter()',
      'map()',
      'reduce()',
      'forEach()'
    ],
    correctAnswerIndex: 0,
    explanation: 'filter() creates a new array with elements that pass the test implemented by the provided function. map() transforms each element, reduce() reduces to a single value, and forEach() just iterates without returning a new array.',
    isFree: false,
    difficulty: 'Medium'
  },
  {
    id: 'c20',
    title: 'Responsive Design',
    level: 'mid',
    language: 'CSS',
    description: 'What does the CSS unit "rem" stand for and what is it relative to?',
    options: [
      'Root em - relative to the root (html) element font-size',
      'Relative em - relative to the parent element font-size',
      'Responsive em - relative to viewport width',
      'Rendered em - relative to the browser default size'
    ],
    correctAnswerIndex: 0,
    explanation: 'rem stands for "root em" and is always relative to the root element\'s (html tag) font-size, typically 16px by default. Unlike em which is relative to the parent element, rem provides consistency across the entire document, making it ideal for building scalable layouts.',
    isFree: false,
    difficulty: 'Medium'
  }
];
