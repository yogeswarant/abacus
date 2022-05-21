import Dexie from 'dexie';
export const db = new Dexie('myDatabase');


db.version(1).stores({
  questions: '++id, index, numbers, correctAnswer, userAnswer, status',
  attempts: '++id, timestamp'
});

const saveQA = (qa) => {
  db.questions.add(qa)
}

const saveAttempt = (ts) => {
  db.attempts.add({timestamp: ts})
}

export {
  saveQA,
  saveAttempt
}