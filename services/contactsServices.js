import Contact from "../db/models/contact.js";

// Функція для зчитування всіх контактів
export const listContacts = () => Contact.findAll();

// Функція для додавання нового контакту
export const addContact = (name, email, phone) =>
  Contact.create({ name, email, phone });

// Функція для отримання контакту за ID
export const getContactById = (id) => Contact.findByPk(id);

// Функція для оновлення контакту за ID
export const updateContact = async (id, updatedContact) => {
  const contact = await getContactById(id);
  if (!contact) return null;

  return contact.update(updatedContact);
};

// Функція для видалення контакту за ID
export const removeContact = (id) => Contact.destroy({ where: { id } });
