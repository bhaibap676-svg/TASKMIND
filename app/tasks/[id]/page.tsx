"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Camera, Mic, FileText, Database, MoreHorizontal, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  photo_verification: Camera,
  voice_recording: Mic,
  text_review: FileText,
  data_entry: Database,
  other: MoreHorizontal,
};

export default function TaskDetailPage() {
  const params = useParams();
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionType, setSubmissionType] = useState<"image" | "text">("image");
  const [submissionText, setSubmissionText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  async function fetchTask() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setTask(data);
    } catch (err) {
      console.error("Error fetching task:", err);
      toast.error("Task not found");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile && !submissionText.trim()) {
      toast.error("Please provide a submission");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to submit");
        setIsSubmitting(false);
        return;
      }

      // Upload file if image
      let submissionUrl = null;
      if (uploadedFile && submissionType === "image") {
        const fileExt = uploadedFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("submissions")
          .upload(fileName, uploadedFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("submissions")
          .getPublicUrl(fileName);
        
        submissionUrl = publicUrl;
      }

      // Insert submission
      const { error: insertError } = await supabase
        .from("submissions")
        .insert({
          user_id: user.id,
          task_id: task.id,
          submission_type: submissionType,
          submission_url: submissionUrl,
          submission_text: submissionText || null,
          status: "pending"
        });

      if (insertError) throw insertError;

      toast.success("Submission submitted for review!");
      
      // Reset form
      setSubmissionText("");
      setUploadedFile(null);
      setUploadPreview(null);
    } catch (err: any) {
      console.error("Error submitting:", err);
      toast.error(err.message || "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Task not found</h2>
          <Link href="/tasks" className="text-navy-900 hover:underline mt-2 inline-block">
            Back to tasks
          </Link>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[task.category] || MoreHorizontal;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/tasks" className="inline-flex items-center text-gray-600 hover:text-navy-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-navy-50 rounded-lg flex items-center justify-center">
                <Icon className="w-7 h-7 text-navy-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-navy-900">{task.title}</h1>
                <span className="text-sm text-gray-500 capitalize">{task.category?.replace("_", " ")}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gold-500">${task.reward_amount}</div>
              <div className="text-sm text-gray-500">reward</div>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <h3 className="font-semibold text-navy-900 mb-2">Instructions</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Client Fee: ${task.total_client_fee}</span>
            <span>•</span>
            <span>Your Reward: ${task.reward_amount}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Submit Your Work</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Submission Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSubmissionType("image")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    submissionType === "image" 
                      ? "bg-navy-900 text-white" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Image Upload
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionType("text")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    submissionType === "text" 
                      ? "bg-navy-900 text-white" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Text Response
                </button>
              </div>
            </div>

            {submissionType === "image" ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {uploadPreview ? (
                    <div className="relative">
                      <img src={uploadPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => { setUploadedFile(null); setUploadPreview(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-navy-900 font-medium hover:underline">Click to upload</span>
                        <span className="text-gray-500"> or drag and drop</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Enter your response here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent resize-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-navy-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit for Review"
              )}
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              By submitting, you agree to our Terms of Service
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
