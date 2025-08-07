
import RuleEditor from "./RuleEditor";
import DataSourceSelector from "./DataSourceSelector";
import AnimatedCard from "../UI/AnimatedCard";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white/10 border-r border-white/10 backdrop-blur-md shadow-lg p-6 overflow-auto animate-fade-in space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300">
      <h2 className="text-xl font-bold text-white mb-4">⚙️ Control Panel</h2>
      <AnimatedCard>
        <DataSourceSelector />
      </AnimatedCard>
      <AnimatedCard>
        <RuleEditor />
      </AnimatedCard>
    </aside>
  );
}
