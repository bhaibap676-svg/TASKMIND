"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Camera, Mic, FileText, Database, MoreHorizontal, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  photo_verification: Camera,
  voice_recording: Mic,
  text_review: FileText,
  data_entry: Database,
  other: MoreHorizontal,
};

const categoryLabels: Record<string, string> = {
  photo_verification: "Photo Verification",
  voice_recording: "Voice Recording",
  text_review: "Text Review",
  data_entry: "Data Entry",
  other: "Other",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-6">Available Tasks</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {["all", "photo_verification", "voice_recording", "text_review", "data_entry"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedCategory === cat ? "bg-navy-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat === "all" ? "All Tasks" : categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => {
              const Icon = categoryIcons[task.category] || MoreHorizontal;
              return (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-navy-900" />
                    </div>
                    <span className="text-gold-500 font-bold text-lg">${task.reward_amount?.toFixed(2)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2 group-hover:text-gold-500 transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{categoryLabels[task.category] || "Other"}</span>
                    <div className="flex items-center gap-1 text-navy-900 font-medium text-sm">
                      Start Task
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {filteredTasks.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
