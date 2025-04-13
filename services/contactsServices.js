import Contact from "../db/models/contact.js";

// Функція для зчитування всіх контактів
export const listContacts = (query) => Contact.findAll({ where: query });

// Функція для додавання нового контакту
export const addContact = (data) => Contact.create(data);

// Функція для отримання контакту за ID
export const getContactById = (id) => Contact.findByPk(id);

// Функція для оновлення контакту за ID
export const updateContact = async (query, data) => {
  const contact = await getContactById(query);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
};

// Функція для видалення контакту за ID
export const removeContact = (query) => Contact.destroy({ where: { query } });
