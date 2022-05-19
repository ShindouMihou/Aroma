import mongo from "$lib/mongo";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

export default class Account {
    _id: string;
    name: string;
    email: string;
    avatar_hash: string;
    about_me: string;
    verified: boolean;

    constructor(_id: string, name: string, email: string, avatar_hash: string, about_me: string, verified: boolean) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.about_me = about_me;
        this.avatar_hash = avatar_hash;
        this.verified = verified || false;
    }

    /**
     * Performs an update to MongoDB to update the verification property of this account.
     * 
     * @returns The result from updating the document.
     */
    public async verify() {
        return Account.update(this._id, {
            'verified': true
        })
    }

    /**
     * Clones this {@link Account} without the properties specified. This is more used when creating a 
     * new {@link Account} where you want MongoDB to generate the identifier or when you want to show the {@link Account} 
     * but without the email address.
     * 
     * @param elements The elements to exclude from the clone.
     * @returns A clone of this {@link Account} instance but without the properties or elements 
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
     * Updates an {@link Account}'s fields to reflect a newer state without replacing the entire 
     * document from the database.
     * 
     * @param id The account identifier to update.
     * @param $set The fields to change value.
     * @returns The update result from MongoDB.
     */
    public static async update(id: string, $set: object) {
        return mongo.getClient().then(client => client!.db('aroma').collection('users').updateOne({ _id: new ObjectId(id) }, {
            $set: $set
        }))
    }

    /**
     * Finds one account that matches the given email address, returns null if there isn't.
     * 
     * @param email The email of the account to find.
     * @returns The account that matched the email address, otherwise none.
     */
    public static async withEmail(email: string): Promise<Account | null> {
        return Account.find({
            email: email.toLowerCase()
        })
    }

    /**
     * Finds one account that matches the given identifier, returns null if there isn't.
     * 
     * @param id The id of the account to find.
     * @returns The account that matched the identifier, otherwise none.
     */
    public static async withId(id: string): Promise<Account | null> {
        return Account.find({
            _id: new ObjectId(id)
        })
    }

    /**
     * Finds one account that matches the given specifications, returns null if there isn't.
     * 
     * @param request The specifications of the account to find.
     * @returns The account that matched the specifications, otherwise none.
     */
    public static async find(request: object): Promise<Account | null> {
        return mongo.getClient()
            .then(client => client!.db('aroma').collection('users').findOne(request))
            .then(result => {
                if (!result) {
                    return null;
                }

                return new Account(
                    result._id.toString(), result.name, result.email, result.avatar_hash, result.about_me, result.verified
                )
            }).catch(err => {
                console.error(err)

                throw {
                    error: "An internal error occurred while trying to get the user."
                }
            })
    }

    /**
     * Creates a new {@link Account} with the given initial parameters.
     * 
     * @param name The name of the {@link Account}.
     * @param email The email address of the {@link Account}.
     * @param password The password of the {@link Account}.
     * @returns The new {@link Account} that was created.
     */
    public static async create(name: string, email: string, password: string): Promise<Account> {
        try {
            email = email.toLowerCase()
            
            const hash = await bcrypt.hash(password, 10);
            const client = (await mongo.getClient())!;

            if (await Account.withEmail(email)) {
                throw {
                    error: "A user with the same email already exists."
                }
            }

            const account = new Account(
                '', name, email, 'default.jpg', 'None has been set.', false
            )

            const result = await client.db('aroma').collection('users').insertOne(account.without('_id'))

            account._id = result.insertedId.toString()

            await client.db('aroma').collection('userSecrets').insertOne({
                email: account.email,
                password: hash
            })

            return account
        } catch (err: any) {
            if (err.error) {
                throw err
            }

            throw {
                error: "An internal error occurred while trying to create the user."
            }
        }
    }
}