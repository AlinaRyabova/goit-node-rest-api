import Contact from "../db/models/contact.js";

// Функція для зчитування всіх контактів
export const listContacts = ({ owner }) =>
  Contact.findAll({
    where: { owner },
  });

// Функція для додавання нового контакту
export const addContact = (contact) => Contact.create(contact);

// Функція для отримання контакту за ID
export const getContactById = (id, owner) =>
  Contact.findOne({ where: { id, owner } });

// Функція для оновлення контакту за ID
export const updateContact = async (id, owner, data) => {
  const contact = await getContactById(id, owner);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
};

// Функція для видалення контакту за ID
export const removeContact = async (id, owner) => {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  await contact.destroy();
  return contact;
};
