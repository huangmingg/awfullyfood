import { getTransactionsBySeller, getTransactionByBuyer } from "@/services/transaction.service";

const getReviews = async (userId, role) => {
    const key = role === 'Buyer' ? 'buyerReview' : 'sellerReview';
    const transactions = role === 'Buyer' ? await getTransactionByBuyer(userId) : await getTransactionsBySeller(userId);
    return transactions.map((ele) => {
        return { ...ele[key], userId: role === 'Buyer' ? ele['sellerId'] : ele['buyerId'] };
    });
}

const getAggregatedRating = reviews => {
    const length = reviews.length;
    if (length) {
        const total = reviews.map(ele => { return ele.rating }).reduce((a,b) => { return a+b, 0 });
        return (total / length);
    } else {
        return 0;
    }
}


export {
    getReviews,
    getAggregatedRating
}
