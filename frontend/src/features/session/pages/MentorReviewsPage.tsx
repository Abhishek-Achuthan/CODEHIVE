import { useMentorReviews } from "../hooks/useMentorReviews";
import { Loader2, Star, User, Link as LinkIcon, Maximize2 } from "lucide-react";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { Pagination } from "../../../shared/ui/Pagination";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ReviewModal } from "../components/ReviewModal";
import { useState } from "react";
import type { MentorReview } from "../hooks/useMentorReviews";

export default function MentorReviewsPage() {
    const { reviews, loading, error, currentPage, totalPages, setCurrentPage } = useMentorReviews();
    const [selectedReview, setSelectedReview] = useState<MentorReview | null>(null);
    const navigate = useNavigate();
    
    const handleProfileClick = (review: MentorReview) => {
        if (review.student?.role === 'MENTOR') {
            navigate(`/mentors/${review.studentId}`);
        } else {
            toast.error("Public profile is not available for this user");
        }
    };

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
                                    <button 
                                        type="button"
                                        onClick={() => handleProfileClick(review)}
                                        className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white cursor-pointer"
                                    >
                                        {review.student?.avatarUrl ? (
                                            <img src={review.student.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-5 w-5" />
                                        )}
                                    </button>
                                    <div 
                                        className="cursor-pointer hover:underline"
                                        onClick={() => handleProfileClick(review)}
                                    >
                                        <h3 className="text-sm font-medium text-white">
                                            {review.student ? `${review.student.firstName} ${review.student.lastName}` : "Unknown User"}
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
                                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                                    "{review.reviewText}"
                                </p>
                            )}
                            
                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                {review.roomId && (
                                    <Link
                                        to={`/room/${review.roomId}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors"
                                    >
                                        <LinkIcon className="h-3.5 w-3.5" />
                                        View Session Room
                                    </Link>
                                )}
                                <button
                                    onClick={() => setSelectedReview(review)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-zinc-300 text-xs font-medium hover:bg-white/10 transition-colors"
                                >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                    View Full Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {!loading && reviews.length > 0 && (
                <div className="mt-8">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            <ReviewModal
                open={!!selectedReview}
                onClose={() => setSelectedReview(null)}
                onSubmit={async () => {}}
                loading={false}
                readOnly={true}
                initialRating={selectedReview?.rating}
                initialReviewText={selectedReview?.reviewText}
                createdAt={selectedReview?.createdAt}
                isHostView={true}
            />
        </div>
    );
}
