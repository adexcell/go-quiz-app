import React from 'react';
import { Quiz } from './components/Quiz';

function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-gray-100 flex flex-col font-sans selection:bg-blue-500/30">
      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto md:max-w-2xl">
        <Quiz />
      </main>
    </div>
  );
}

export default App;