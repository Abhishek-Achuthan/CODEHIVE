import { useMentorReviews } from "../hooks/useMentorReviews";
import { Loader2, Star, User } from "lucide-react";
import { EmptyState } from "../../../shared/ui/EmptyState";

export default function MentorReviewsPage() {
    const { reviews, loading, error } = useMentorReviews();

    return (
        <div className="flex flex-col">

            {loading ? (
                <div className="flex min-h-[400px] justify-center items-center bg-white/[0.01] rounded-3xl border border-white/5">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                </div>
            ) : error ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            ) : reviews.length === 0 ? (
                <EmptyState
                    animationSrc="https://lottie.host/c878f65a-2ee7-401f-b813-9899fccd135a/7q1YxDrkmN.json"
                    title="No reviews yet"
                    description="You haven't received any reviews yet. Once a student completes a session and leaves feedback, it will appear here."
                />
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {reviews.map((review) => (
                        <div key={review.id} className="rounded-2xl border border-gray-800 bg-black p-5 transition-colors hover:bg-gray-950/40">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white">
                                            {review.student?.firstName} {review.student?.lastName}
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-medium text-amber-400">{review.rating.toFixed(1)}</span>
                                </div>
                            </div>
                            
                            {review.reviewText && (
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                    "{review.reviewText}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
