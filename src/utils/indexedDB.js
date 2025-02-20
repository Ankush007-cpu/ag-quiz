import { openDB } from "idb";

const DB_NAME = "QuizDB";
const STORE_NAME = "quizHistory";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    }
  },
});

export async function saveQuizAttempt(score, totalQuestions) {
  try {
    const db = await dbPromise;
    const timestamp = new Date().toLocaleString();

    await db.add(STORE_NAME, { score, totalQuestions, timestamp });
    console.log("Saved to IndexedDB:", { score, totalQuestions, timestamp });
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
  }
}

export async function getQuizHistory() {
  try {
    const db = await dbPromise;
    const history = await db.getAll(STORE_NAME);
    console.log("Retrieved history:", history);
    return history;
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    return [];
  }
}
