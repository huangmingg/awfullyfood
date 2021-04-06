export class TransactionCreate {
  constructor(transaction) {
    this.listingId = transaction.listingId;
    this.buyerId = transaction.buyerId;
    this.sellerId = transaction.sellerId;
    this.quantity = transaction.quantity;
    this.buyerReview = transaction.buyerReview ? transaction.buyerReview : {};
    this.sellerReview = transaction.sellerReview ? transaction.sellerReview : {};
    this.isApproved = transaction.isApproved ? transaction.isApproved : false;
    this.createdAt = transaction.createdAt;
    this.deletedAt = transaction.deletedAt;
  }
}

export class TransactionRead extends TransactionCreate {
  constructor(transaction, id, listName) {
    super(transaction);
    this.id = id;
    this.listName = listName;
  }
}

export class TransactionUpdate {
  constructor(obj) {
    const getData = (data) => ({
      ...data.buyerReview && { buyerReview: data.buyerReview },
      ...data.sellerReview && { sellerReview: data.sellerReview },
      ...data.isApproved && { isApproved: data.isApproved },
      ...data.completedAt && { completedAt: data.completedAt },
      ...data.deletedAt && { deletedAt: data.deletedAt },
    });
    for (const [key, value] of Object.entries(getData(obj))) {
      this[key] = value;
    }
  }
}
