 /**
  * Generate unique ids using crypto.randomUUID when available
  * Fallback to Date.now() + Math.random()
  */
 // PUBLIC_INTERFACE
 export function generateId() {
   try {
     if (typeof crypto !== 'undefined' && crypto.randomUUID) {
       return crypto.randomUUID();
     }
   } catch {
     // ignore
   }
   return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
 }
