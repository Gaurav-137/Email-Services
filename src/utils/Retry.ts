export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt === retries) throw error;
      await new Promise(res => setTimeout(res, delay * Math.pow(2, attempt)));
    }
  }
  throw new Error("Max retry attempts reached");
}