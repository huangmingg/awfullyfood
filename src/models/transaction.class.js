import Review from "@/models/review.class"

class Transaction {
    constructor(obj) {
        this.id = obj.id;
        this.buyerId = obj.buyerId;
        this.sellerId = obj.sellerId;
        this.listingId = obj.listingId;
        this.quantity = obj.quantity;
        this.isApproved = obj.isApproved;
        this.createdAt = obj.createdAt;
        this.completedAt = obj.completedAt;
        this.buyerReview = new Review(obj.buyerReview);
        this.sellerReview = new Review(obj.sellerReview);
    }
}

module.exports = Transaction;
