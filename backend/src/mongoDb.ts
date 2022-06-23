require('dotenv').config()
console.log('process.env.password', !!process.env.MONGODB_PW) // remove this after you've confirmed it working

const connectionString = `mongodb+srv://TicTacToeApp:${process.env.MONGODB_PW}@somethingfrisky.piat2w4.mongodb.net/?retryWrites=true&w=majority`
import { MongoClient } from "mongodb";
import { Game } from "./types";

// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL

const client = new MongoClient(connectionString);

// Database Name
const dbName = 'ticTacToe';

async function main() {
  console.log('before connect')
    // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('games');
  // const result = await collection.insertOne({ prop: 'knife' })
  // the following code examples can be pasted here...

  return 'done.';
}

export const saveGame = async (game: Game) => {
  const db = client.db(dbName);
  const collection = db.collection<Game>('games');
  const result = await collection.insertOne(game)
  return result.insertedId
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

