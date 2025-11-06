const API_URL = import.meta.env.VITE_API_URL;
const USER_ID = 1; //replace later

export const fetchWantToRead = async () => {
  try {
    const response = await fetch(`${API_URL}/users/${USER_ID}/lists/want-to-read/entries`);
    if (!response.ok) {
      throw new Error(`There are no books on your list yet! Add some from the Search Books page.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

export const fetchHaveRead = async () => {
  try {
    const response = await fetch(`${API_URL}/users/${USER_ID}/lists/have-read/entries`);
    if (!response.ok) {
      throw new Error(`There are no books on your list yet! Add some from the Search Books page.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

export const postToList = async (list_type, body) => {
	try {
		const response = await fetch(`${API_URL}/users/${USER_ID}/lists/${list_type}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error(`Could not create entry for list ${list_type}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export const patchListEntry = async (list_type, entry_id, body) => {
	try {
		const response = await fetch(`${API_URL}/users/${USER_ID}/lists/${list_type}/entries/${entry_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error(`Could not edit entry ${entry_id}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export const deleteListEntry = async(list_type, entry_id) => {
  try {
    const response = await fetch(`${API_URL}/users/${USER_ID}/lists/${list_type}/entries/${entry_id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Could not delete entry`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchDBBook = async (id) => {
	try {
    const response = await fetch(`${API_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error(`Could not fetch book ${id}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching book:", error);
    throw error;
  }
}