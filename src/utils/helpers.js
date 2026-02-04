// Function to handle fulfilled async dispatch responses
export const handleResponse = async (
  actionPromise,
  onSuccess,
  onFailure = () => {} 
) => {
  try {
    const res = await actionPromise;
    if (res.meta?.requestStatus === "fulfilled") {
      onSuccess?.(res); 
    } else {
      onFailure?.(res); 
    }
  } catch (error) {
    console.error("Async action failed:", error);
    onFailure?.(error); 
  }
};