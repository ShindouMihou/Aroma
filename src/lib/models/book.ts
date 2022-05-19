import mongo from "$lib/mongo";
import { ObjectId } from "mongodb";
import type Account from "./user";

export class Book {
    _id: string;
    title: string;
    description: string;
    author: string;
    cover: string;
    published: boolean;
    status: BookStatus;

    constructor(_id: string, title: string, description: string, author: string, cover: string, published: boolean, status: BookStatus) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.cover = cover;
        this.published = published;
        this.status = status;
    }

    /**
     * Clones this {@link Book} without the properties specified.
     * 
     * @param elements The elements to exclude from the clone.
     * @returns A clone of this {@link Book} instance but without the properties or elements 
     * specified.
     */
    public without(...elements: string[]) {
        const clone: any = {}

        Object.entries(this).forEach(entry => {
            if (elements.includes(entry[0])) {
                return;
            }

            clone[entry[0]] = entry[1]
        })

        return clone
    }

    /**
     * Performs an aggregate query on the database to get all the likes of this book.
     * 
     * @returns The total amount of likes that this book has.
     */
    public async likes(): Promise<number> {
        return mongo.getClient().then(client => client!.db('aroma').collection('likes').aggregate([
            {
                '$match': {
                    'book': new ObjectId(this._id)
                }
            }, {
                '$count': 'count'
            }
        ]).toArray()).then(result => result[0].count)
    }

    /**
     * Deletes one like from the given user for this book.
     * 
     * @param user The user who performed this action.
     * @returns The delete result from MongoDB.
     */
    public async unlike(user: Account) {
        return mongo.getClient().then(client => client!.db('aroma').collection('likes').deleteOne({
            user: new ObjectId(user._id),
            book: new ObjectId(this._id)
        }))
    }

    /**
     * Deletes one bookmark from the given user for this bookmark.
     * 
     * @param user The user who performed this action.
     * @returns The delete result from MongoDB.
     */
    public async unbookmark(user: Account) {
        return mongo.getClient().then(client => client!.db('aroma').collection('bookmarks').deleteOne({
            user: new ObjectId(user._id),
            book: new ObjectId(this._id)
        }))
    }

    /**
    * Inserts an bookmark that is associated with the user and this book.
    * 
    * @param user The user who performed this action.
    * @returns The insert result given from MongoDb.
    */
    public async bookmark(user: Account) {
        return mongo.getClient().then(client => client!.db('aroma').collection('bookmarks').insertOne({
            user: new ObjectId(user._id),
            book: new ObjectId(this._id)
        }))
    }

    /**
     * Inserts an like that is associated with the user and this book.
     * 
     * @param user The user who performed this action.
     * @returns The insert result given from MongoDb.
     */
    public async like(user: Account) {
        return mongo.getClient().then(client => client!.db('aroma').collection('likes').insertOne({
            user: new ObjectId(user._id),
            book: new ObjectId(this._id)
        }))
    }

    /**
     * Updates an {@link Book}'s fields to reflect a newer state without replacing the entire 
     * document from the database.
     * 
     * @param id The book identifier to update.
     * @param $set The fields to change value.
     * @returns The update result from MongoDB.
     */
    public static async update(id: string, $set: object) {
        return mongo.getClient().then(client => client!.db('aroma').collection('books').updateOne({ _id: new ObjectId(id) }, {
            $set: $set
        }))
    }

    /**
     * Finds one book that matches the given identifier, returns null if there isn't.
     * 
     * @param id The id of the book to find.
     * @returns The book that matched the identifier, otherwise none.
    */
    public static async withId(id: string): Promise<Book | null> {
        return Book.find({
            _id: new ObjectId(id)
        })
    }

    /**
    * Checks whether the user has liked the book or not.
    * 
    * @param user The user to check whether they have liked this book or not.
    * @param bookId The book identifier to check.
    * @returns Does this user have a like on the book?
    */
    public static async hasLike(bookId: string, user: Account): Promise<Boolean> {
        return mongo.getClient().then(client => client!.db('aroma').collection('likes').findOne({
            user: new ObjectId(user._id),
            book: new ObjectId(bookId)
        })).then(result => result != null)
    }

    /**
     * Checks whether the user has bookmarked the book or not.
     * 
     * @param user The user to check whether they have a bookmark or not.
     * @param bookId The book identifier to check.
     * @returns Does this user have a bookmark on this book?
     */
    public static async hasBookmark(bookId: string, user: Account): Promise<Boolean> {
        return mongo.getClient().then(client => client!.db('aroma').collection('bookmarks').findOne({
            user: new ObjectId(user._id),
            book: new ObjectId(bookId)
        })).then(result => result != null)
    }

    /**
     * Finds one book that matches the given specifications, returns null if there isn't.
    * 
    * @param request The specifications of the book to find.
    * @returns The book that matched the specifications, otherwise none.
    */
    public static async find(request: object): Promise<Book | null> {
        return mongo.getClient()
            .then(client => client!.db('aroma').collection('books').findOne(request))
            .then(result => {
                if (!result) {
                    return null;
                }

                return new Book(
                    result._id.toString(), result.title, result.description, result.author, result.cover, result.published, result.status
                )
            }).catch(err => {
                console.error(err)

                throw {
                    error: "An internal error occurred while trying to get the user."
                }
            })
    }
}

export enum BookStatus {
    COMPLETED,
    HIATUS,
    ONGOING,
    DROPPED
}