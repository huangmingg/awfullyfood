import { getTransactionsBySeller, getTransactionsByBuyer } from '@/services/transaction.service';
import { getDisplayName } from '@/services/user.service';

const getReviews = async (userId, role) => {
  const key = role === 'Buyer' ? 'buyerReview' : 'sellerReview';
  const transactions = role === 'Buyer' ? await getTransactionsByBuyer(userId) : await getTransactionsBySeller(userId);
  return Promise.all(
    transactions.map(async (ele) => {
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
    const total = reviews.map((ele) => { return ele.rating; }).reduce((a, b) => { return a + b, 0; });
    return (total / length);
  }
  return 0;

};


export {
  getReviews,
  getAggregatedRating,
};
