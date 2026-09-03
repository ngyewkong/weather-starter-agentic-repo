import { Sidebar } from './Sidebar';
import { Hero } from './Hero';
import { ThemeSelector } from './ThemeSelector';

export function Layout() {
  return (
    <div className="flex h-full min-h-screen w-full">
      <div className="fixed right-4 top-4 z-40">
        <ThemeSelector />
      </div>
      <Sidebar />
      <Hero />
    </div>
  );
}
