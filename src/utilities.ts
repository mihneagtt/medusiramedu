export const api_GET = async (path: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://tiny-lizard-94.telebit.io/api/${path}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable as a stream");
    }

    const decoder = new TextDecoder();
    let result = "";

    // Process the stream
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode the chunk and add to result
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
    }

    return result;
  } catch (error) {
    console.error("Error fetching:", error);
    throw new Error("Error fetching");
  }
};
export const api_DELETE = async (path: string): Promise<void> => {
  try {
    const response = await fetch(
      `https://tiny-lizard-94.telebit.io/api/${path}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting:", error);
    throw new Error("Error deleting");
  }
};
export const api_ADD = async (path: string, data: unknown): Promise<void> => {
  try {
    // Send data to the API
    const response = await fetch(
      `https://tiny-lizard-94.telebit.io/api/${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add: ${errorText}`);
    }
  } catch (error) {
    console.error("Error adding:", error);
    throw new Error("Error adding");
  }
};
export const api_UPDATE = async (
  path: string,
  data: unknown
): Promise<void> => {
  try {
    // Send data to the API
    const response = await fetch(
      `https://tiny-lizard-94.telebit.io/api/${path}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update: ${errorText}`);
    }
  } catch (error) {
    console.error("Error updating:", error);
    throw new Error("Error updating");
  }
};
