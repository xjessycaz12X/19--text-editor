import { openDB } from 'idb';

// Initialize the database
const initdb = async () => {
  try {
    const db = await openDB('jate', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('jate')) {
          db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
          console.log('jate database created');
        } else {
          console.log('jate database already exists');
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Error initializing database: ', error);
  }
};

// Function to add new content to the database; this will auto-increment the ID
export const addNewEntry = async (content) => {
  try {
    console.log('Attempting to add new entry with content: ', content);
    const db = await openDB('jate', 2);
    const tx = db.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    const result = await store.add({ content });
    await tx.complete;
    console.log('New entry added to the database with an ID of: ', result);
    return result;
  } catch (error) {
    console.error('Failed to add new entry: ', error);
  }
};

// Function to get all content from the database
export const getDb = async () => {
  try {
    console.log('GET all from the database');
    const db = await openDB('jate', 2);
    const tx = db.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const result = await store.getAll();
    console.log('All entries fetched from the database: ', result);
    return result;
  } catch (error) {
    console.error('Error fetching from the database: ', error);
  }
};

// Function to update existing entries in the database
export const updateEntry = async (id, content) => {
  try {
    const db = await openDB('jate', 2);
    const tx = db.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    const result = await store.put({ id, content});
    await tx.complete;
    console.log('Entry updated with ID: ', id);
    return result;
  } catch (error) {
    console.error('Failed to update entry: ', error);
  }
};

// Call the initdb function
initdb().then(() => {
  console.log('Database initialized and ready for transactions');
}).catch((error) => {
  console.error('Failed to initialize database on startup: ', error);
});