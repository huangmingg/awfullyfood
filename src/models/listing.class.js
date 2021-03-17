import Metadata from '@/models/metadata.class'

class Listing {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.price = obj.price;
        this.quantity = obj.quantity;
        this.unit = obj.unit;
        this.category = obj.category;
        this.status = obj.status;
        this.createdAt = obj.createdAt;
        this.expiredAt = obj.expiredAt;
        this.sellerId = obj.sellerId;
        this.likes = new Metadata(obj.likes);
        this.interests = new Metadata(obj.interests);
    }
}

module.exports = Listing;
