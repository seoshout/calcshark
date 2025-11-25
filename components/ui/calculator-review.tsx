'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReCaptcha, { verifyRecaptcha } from '@/components/ui/recaptcha';

interface Review {
  id: string;
  rating: number;
  name: string;
  date: string;
  comment: string;
  helpful: number;
}

interface CalculatorReviewProps {
  calculatorName: string;
  className?: string;
}

export default function CalculatorReview({
  calculatorName,
  className = ""
}: CalculatorReviewProps) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Reviews (would be loaded from database/API in production)
  const [reviews, setReviews] = useState<Review[]>([]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (userRating === 0 || !userName.trim() || !reviewText.trim()) {
      alert('Please fill in all fields and select a rating');
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA verification');
      return;
    }

    setIsVerifying(true);

    try {
      // Verify reCAPTCHA token
      const isValid = await verifyRecaptcha(recaptchaToken);

      if (!isValid) {
        alert('reCAPTCHA verification failed. Please try again.');
        setRecaptchaToken(null);
        setIsVerifying(false);
        return;
      }

      // Create and add the review
      const newReview: Review = {
        id: Date.now().toString(),
        rating: userRating,
        name: userName,
        date: new Date().toISOString().split('T')[0],
        comment: reviewText,
        helpful: 0
      };

      setReviews([newReview, ...reviews]);
      setSubmitted(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setUserRating(0);
        setReviewText('');
        setUserName('');
        setRecaptchaToken(null);
        setSubmitted(false);
        setIsVerifying(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review. Please try again.');
      setIsVerifying(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-5 w-5 transition-colors",
              interactive && "cursor-pointer",
              star <= (interactive ? (hoverRating || userRating) : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            )}
            onClick={() => interactive && setUserRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div id="calculator-review-section" className={cn("bg-background border rounded-xl p-6 sm:p-8 scroll-mt-20", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Calculator Reviews</h2>
      </div>

      {/* Average Rating Summary */}
      <div className="bg-accent/50 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating))}
            <div className="text-sm text-muted-foreground mt-2">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-12">{rating} star</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Review Form */}
      <div className="bg-accent/30 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Share Your Experience</h3>
        {submitted ? (
          <div className="text-center py-4 text-green-600 font-medium">
            ✓ Thank you for your review!
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Rating *
              </label>
              {renderStars(userRating, true)}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Review *
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this calculator..."
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Verification *
              </label>
              <ReCaptcha
                onVerify={(token) => setRecaptchaToken(token)}
                onExpire={() => setRecaptchaToken(null)}
                onError={() => setRecaptchaToken(null)}
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || !recaptchaToken}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <div className="border border-border rounded-lg p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No reviews yet</p>
            <p className="text-sm text-muted-foreground">Be the first to share your experience with this calculator!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-foreground">{review.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-foreground mb-3">{review.comment}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Reviews are from users who have used this calculator.
          Individual results may vary based on your specific situation and inputs.
        </p>
      </div>
    </div>
  );
}
