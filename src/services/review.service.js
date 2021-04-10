import { getTransactionsBySeller, getTransactionsByBuyer, updateTransaction } from '@/services/transaction.service';
import { getDisplayName } from '@/services/user.service';
import { getCurrentTimestamp, isEmptyObject } from '@/services/utils.service';
import { Review } from '@/models/review.class';

const getReviews = async (userId, role) => {
  const key = role === 'Buyer' ? 'buyerReview' : 'sellerReview';
  const transactions = role === 'Buyer' ? await getTransactionsByBuyer(userId) : await getTransactionsBySeller(userId);
  return Promise.all(
    transactions
      .filter((ele) => { return role === 'Buyer' ? !isEmptyObject(ele.buyerReview) : !isEmptyObject(ele.sellerReview) ; })
      .map(async (ele) => {
        return {
          ...ele[key],
          username: role === 'Buyer' ? await getDisplayName(ele.sellerId) : await getDisplayName(ele.buyerId),
          userId: role === 'Buyer' ? ele.sellerId : ele.buyerId,
        };
      })
  );
};

const getAggregatedRating = (reviews) => {
  const length = reviews.length;
  if (length) {
    const total = reviews.map((ele) => { return ele.rating ? ele.rating : 0; }).reduce((a, b) => { return a + b; });
    return (total / length);
  }
  return 0;
};

const updateBuyerReview = async (transactionId, rating, description) => {
  const reviewPayload = new Review(rating, description, getCurrentTimestamp());
  return await updateTransaction(transactionId, { buyerReview: { ...reviewPayload } });
};

const updateSellerReview = async (transactionId, rating, description) => {
  const reviewPayload = new Review(rating, description, getCurrentTimestamp());
  return await updateTransaction(transactionId, { sellerReview: { ...reviewPayload } });
};


export {
  getReviews,
  getAggregatedRating,
  updateBuyerReview,
  updateSellerReview,
};
