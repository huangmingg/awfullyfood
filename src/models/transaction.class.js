import {ListingCreate} from "@/models/listing.class";

export class TransactionCreate {
    constructor(transaction) {
        this.listingId = transaction.listingId;
        this.buyerId = transaction.buyerId;
        this.sellerId = transaction.sellerId;
        this.quantity = transaction.quantity;
        this.buyerReview = {};
        this.sellerReview = {};
        this.isApproved = false;
        this.createdAt = transaction.createdAt;
        this.completedAt = transaction.completedAt;
        this.deletedAt = transaction.deletedAt;
    }
}

export class TransactionRead extends TransactionCreate {
    constructor(transaction, id) {
        super(transaction);
        this.id = id;
    }
}

export class TransactionUpdate {
    constructor(obj) {
        const getData = data => ({
            ...data.buyerReview && { expiredAt: data.expiredAt },
            ...data.sellerReview && { expiredAt: data.expiredAt },
            ...data.isApproved && { isApproved: data.isApproved },
            ...data.completedAt && { completedAt: data.completedAt },
            ...data.deletedAt && { deletedAt: data.deletedAt },
        });
        for (const [key, value] of Object.entries(getData(obj))) {
            this[key] = value;
        }
    }
}
