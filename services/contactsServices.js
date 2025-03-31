import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

// Шлях до файлу contacts.json
const contactsPath = path.resolve("db", "contacts.json");

// Функція для зчитування всіх контактів
export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  return contacts;
}

// Функція для отримання контакту за ID
export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

// Функція для видалення контакту за ID
export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [removedContact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removedContact;
}

// Функція для додавання нового контакту
export async function addContact(name, email, phone) {
  const newContact = { id: nanoid(), name, email, phone };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

// Функція для оновлення контакту за ID
export async function updateContact(id, updatedData) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;

  //   const updatedContact = { ...contacts[index], ...updatedData
  // };
  const updatedContact = {
    ...contacts[index],
    ...(updatedData.name && { name: updatedData.name }),
    ...(updatedData.email && { email: updatedData.email }),
    ...(updatedData.phone && { phone: updatedData.phone }),
  };
  contacts[index] = updatedContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
}
