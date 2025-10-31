import React from "react";

export interface ReviewItem {
  id: string;
  description: string;
}

export interface ReviewQueueProps {
  items: ReviewItem[];
  onApprove: (id: string) => void;
  onReject?: (id: string) => void;
}

const ReviewQueue: React.FC<ReviewQueueProps> = ({ items, onApprove, onReject }) => {
  return (
    <div>
      <h2>Review Queue</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.description}</span>
            <button type="button" onClick={() => onApprove(item.id)}>
              Approve
            </button>
            {onReject && (
              <button type="button" onClick={() => onReject(item.id)}>
                Reject
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewQueue;
