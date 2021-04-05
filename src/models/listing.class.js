export class ListingCreate {
    constructor(list) {
        this.sellerId = list.sellerId;
        this.name = list.name;
        this.description = list.description;
        this.price = list.price;
        this.quantity = list.quantity;
        this.unit = list.unit;
        this.category = list.category;
        this.status = list.status;
        this.bookmarks = list.bookmarks ? list.bookmarks : [];
        this.interests = list.interests ? list.interests : [];
        this.createdAt = list.createdAt;
        this.expiredAt = list.expiredAt;
        this.deletedAt = list.deletedAt;
    }
}

export class ListingRead extends ListingCreate {
    constructor(list, id, photo) {
        super(list);
        this.id = id;
        this.photo = photo;
    }
}

export class ListingUpdate {
    constructor(obj) {
        const getData = data => ({
            ...data.sellerId  && { sellerId : data.sellerId },
            ...data.name && { name: data.name },
            ...data.description && { description: data.description },
            ...data.price && { price: data.price },
            ...data.quantity && { quantity: data.quantity },
            ...data.unit && { unit: data.unit },
            ...data.category && { category: data.category },
            ...data.status && { status: data.status },
            ...data.bookmarks && { bookmarks: data.bookmarks },
            ...data.interests && { interests: data.interests },
            ...data.createdAt && { createdAt: data.createdAt },
            ...data.expiredAt && { expiredAt: data.expiredAt },
            ...data.deletedAt && { deletedAt: data.deletedAt },
        });
        for (const [key, value] of Object.entries(getData(obj))) {
            this[key] = value;
        };
    }
}
