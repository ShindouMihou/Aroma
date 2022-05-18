import mongo from "$lib/mongo";
import type { User } from "$lib/types/user";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

export async function create(name: string, email: string, password: string): Promise<User> {
    try {
        email = email.toLowerCase()
        const hash = await bcrypt.hash(password, 10);

        const client = (await mongo.getClient())!;

        const existing = await client.db('aroma').collection('users').findOne({
            email: email
        });

        if (existing) {
            throw {
                error: "A user with the same email already exists."
            }
        }

        const result = await client.db('aroma').collection('users').insertOne({
            about_me: 'None has been set.',
            avatar_hash: 'default.jpg',
            email: email,
            name: name
        })

        const user: User = {
            _id: result.insertedId.toString(),
            about_me: 'None has been set.',
            avatar_hash: 'default.jpg',
            email: email,
            name: name
        }

        client.db('aroma').collection('userSecrets').insertOne({
            email: user.email,
            password: hash
        })

        return user
    } catch (err) {
        if (err.error) {
            throw err
        }

        throw {
            error: "An internal error occurred while trying to create the user."
        }
    }
}

export async function get(id: string): Promise<User | null> {
    try {
        if (!ObjectId.isValid(id)) {
            return null
        }
        
        const client = (await mongo.getClient())!;

        const user = await client.db('aroma').collection('users').findOne({
            _id: new ObjectId(id)
        });
        
        if (user) {
            return {
                _id: user._id.toString(),
                about_me: user.about_me,
                avatar_hash: user.avatar_hash,
                email: user.email,
                name: user.name
            }
        }

        return null
    } catch (err) {
        console.error(err)

        throw {
            error: "An internal error occurred while trying to get the user."
        }
    }
}